const conf = require("../config/conf.js");
const DB = require("./db/" +conf.dbtype + ".js");

const hash = require("crypto-js/"+conf.hashtype);
const TelegramBot = require('node-telegram-bot-api');
const express = require("express");
const bodyParser = require('body-parser');
const protocol = require(conf.protocol);
const port = conf.port;
process.env.NTBA_FIX_319 = 1;
    

module.exports = class Socketgram {
    constructor() {
        this.io;
        this.bot = new TelegramBot(conf.token);
        this.db = new DB();
        this.chatlogin = new Map();
        this.admserv = new Map();
        this.onlineuser = new Map();
        this.onlineadmin = new Map();
    }
    socketConnection(socket) {
        if (socket.handshake.query[conf.adminname] == conf.adminkey) {
            console.log("Admin join to chat");
            this.onlineadmin.set(socket.id, 1);
            this.onlineList();
        } else if (socket.handshake.query.room != hash("id"+socket.handshake.query.id+conf.secretkey) || !socket.handshake.query.id || !socket.handshake.query.room) {
            socket.disconnect(true);
        }
        socket.on('subscribe:servadm', (data) => {
            socket.join(data.room);
            this.onlineList();
        });
        socket.on('subscribe', (data) => {
            socket.join(data.room);
            this.subscribe(data, socket.id);
        });
        socket.on('new message', (data) => {
            this.newMessageFromUser(data, socket.id);
        });
        socket.on('new message:servadm', (data) => {
            this.newMessageFromAdmin(data);
        });
        socket.on('take history', (data) => {
            this.takeHistory(data);
        });
        socket.on('update admlist', () => {
            this.admserv = new Map();
            this.db.setChatName().then((result) => {
                result.forEach((row) => {
                    this.admserv.set(row['aid'], row['name'] + ' ' + conf.company);
                })
            });
        });
        socket.on('disconnect', () => {
            this.disconnect(socket);
        });
    }
    startSocketgram() {
        const app = express();
        app.use(bodyParser.json());
        if (!conf.tlgrm_option.polling) {
            this.bot.setWebHook(`https://${conf.sslconf.hostname}/bot${conf.token}`);
            app.post(`/bot${conf.token}`, (req, res) => {
                this.bot.processUpdate(req.body);
                res.sendStatus(200);
            });
        }

        const server = protocol.createServer(conf.sslconf, app);
        server.listen(port, () => {
            console.log('Socketgram start');
        });
        this.io = require('socket.io')(server);
        this.db.setChatName().then((result) => {
            result.forEach((row) => {
                this.admserv.set(row['aid'], row['name'] + ' ' + conf.company);
            })
        });
        this.db.startServerSTCS().then((result) => {
            result.forEach((row) => {
                if (row['status'] == 0) {
                    this.startMenuTelegram(row['chat_id'], conf.language.writemessage);
                } else {
                    this.changeStatusTelegram(row['chat_id'], 0);
                }
            })
        });
    }
    timeNow(dt) {
        let date;
        if (dt) {
            date = new Date(dt);
        } else {
            date = new Date();
        }
        date.setHours(date.getHours() + conf.time);
        let date1 = date.toISOString().slice(0, 19).replace('T', ' ');
        return date1;
    }
    getByValue(value) {
        for (let [socket_id, data] of this.onlineuser) {
            if (data == value) 
                return socket_id;
        }
        return 0;
    }
    setChatName(data) {
        if (data == 0)
            return data;
        else
            return this.admserv.get(data);
    }
    onlineList() {
        for (let [socket_id, data] of this.onlineuser) {
            this.io.sockets.to(socket_id).emit('online', {
                cid: data
            });
        }
    }
    onlineState(data, socket_id) {
        this.io.sockets.to(socket_id).emit('online', {
            cid: data
        });
    }
    offlineState(data, socket_id) {
        this.io.sockets.to(socket_id).emit('offline', {
            cid: data
        });
    }
    disconnect(socket) {
        if (this.onlineadmin.has(socket.id)) {
            this.onlineadmin.delete(socket.id);
        } else {
            for (let admin of this.onlineadmin.keys()) {
                this.offlineState(this.onlineuser.get(socket.id), admin);
            }
            this.onlineuser.delete(socket.id);
        }
    }
    newMessageSocket(dt, socket_id) {
        if (socket_id !== 0)
            this.io.sockets.to(socket_id).emit('new message', {
                username: dt['cid'],
                message: dt['message'],
                date: this.timeNow(dt['date']),
                adm: this.setChatName(dt['aid']),
                label: dt['id']
            });
    }
    subscribe(data, socket_id) {
        this.onlineuser.set(socket_id, data.username);
        for (let admin of this.onlineadmin.keys()) {
            this.onlineState(data.username, admin);
        }
        this.db.subsctibe(data).then((result) => 
            result.forEach((row) => {
                this.newMessageSocket(row, socket_id);
            })
        );
        this.db.addHistoryButton(data).then((result) => 
            result.forEach((row) => {
                if(row['col'] > 20)
                    this.io.sockets.in(hash("id" + row['cid'] + conf.secretkey).toString()).emit('add history button');
            })
        );
    }
    newMessageFromUser(data, socket_id) {
        this.db.newMessageFromUser(data).then((result) => 
            result.forEach((row) => {
                this.newMessageSocket(row, socket_id);
                for (let admin of this.onlineadmin.keys()) {
                    this.newMessageSocket(row, admin);
                }
            })
        );
    }
    newMessageFromAdmin(data) {
        this.db.newMessageFromAdmin(data).then((result) => {
            result.forEach((row) => {
                if (this.onlineuser.size > 0)
                    this.newMessageSocket(row, this.getByValue(row['cid']));
                for (let admin of this.onlineadmin.keys()) {
                    this.newMessageSocket(row, admin);
                }
                const message = row['message'];
                const aid = row['aid'];
                this.db.newMessageToTelegram(data).then((result) => {
                    result.forEach((row) => {
                        if (row['chat_id'] != 0)
                            this.newMessageToTelegram({chatId: row['chat_id'], message, adm: this.setChatName(aid)})
                    })
                });
            })
        });
    }
    takeHistory(data) {
        this.io.sockets.in(data.room).emit('drop history button');
        this.db.takeHistory(data).then((result) => {
            result.forEach((row) => {
                this.io.sockets.in(data.room).emit('new message history', {
                    username: row['cid'],
                    message: row['message'],
                    date: this.timeNow(row['date']),
                    adm: this.setChatName(row['aid']),
                    label: row['id']
                });
            })
        });
        this.db.addHistoryButtonMid(data).then((result) => 
            result.forEach((row) => {
                if(row['col'] > 10)
                this.io.sockets.in(data.room).emit('add history button');
            })
        );
    }
    newMessageFromTelegram(data) {
        this.db.newMessageFromTelegram(data).then((result) => 
            result.forEach((row) => {
                if (this.onlineuser.size > 0)
                    this.newMessageSocket(row, this.getByValue(row['cid']));
                for (let admin of this.onlineadmin.keys()) {
                    this.newMessageSocket(row, admin);
                }
            })
        );
    }

    newMessageToTelegram(data) {
        this.bot.sendMessage(data.chatId,"<b>"+ conf.language.answeradm + data.adm+":</b>\n"+data.message ,{parse_mode : "HTML"});
    }
    startMenuTelegram(chatId, msg) {
        this.bot.sendMessage(chatId, conf.language.select, {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: msg
                        }
                    ],
                    [
                        {
                            text: conf.language.contacts
                        }
                    ]        
                ],
            }  
        });
    }
    backFuncTelegram(chatId) {
        this.bot.sendMessage(chatId, conf.language.returntostart, {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: conf.language.back
                        }
                    ]      
                ],
            }  
        });
    }
    startTelegram(msg) {
        const chatId = msg.chat.id;
        this.db.startTelegram(msg).then((result) => {
            result.forEach((row) => {
                this.bot.sendMessage(chatId, conf.language.hello + conf.company + ', ' + msg.chat.first_name + '!');
                if (row['cid'] == 0) {
                    this.startMenuTelegram(chatId, conf.language.auth);
                } else {
                    this.startMenuTelegram(chatId, conf.language.writemessage);
                }
            })
        });
    }
    changeStatusTelegram(chatId, status) {
        if (status == 0) {
            this.startMenuTelegram(chatId, conf.language.writemessage);
        } else {
            this.backFuncTelegram(chatId, this.bot);
        }
        this.db.changeStatusTelegram(chatId, status).then();
    }
    checkLoginTelergam(id, chatId) {
        this.db.checkLoginTelergam(id, chatId).then((result) => {
            result.forEach((row) => {
                if (row['chat_id'] != chatId && row['chat_id'] != 0) {
                    this.updateLoginTelergam(row['chat_id'], chatId);
                } else
                    this.loginTelergam(id, chatId);
            })
        });
    }
    updateLoginTelegram(oldl, newl) {
        this.db.updateLoginTelegram(oldl, newl).then();
        this.startMenuTelegram(newl, conf.language.writemessage);
    }
    loginTelergam(id, chatId) {
        this.db.loginTelergam(id, chatId).then();
        this.startMenuTelegram(chatId, conf.language.writemessage)
    }
    messageTelegram(msg) {
        const chatId = msg.chat.id;
        this.db.messageTelegram(msg).then((result) => {
            result.forEach((row) => {
                const status = row['status'];
                const login = row['cid'];
                if (msg.text) {
                    const text = msg.text;
                    if (~text.indexOf(conf.language.contacts)) {  
                        this.bot.sendMessage(chatId, conf.techcontacts,{parse_mode : "HTML"});
                    } else if (~text.indexOf(conf.language.auth)) {
                        this.bot.sendMessage(chatId, conf.language.enterloginhtml, conf.optforce);
                    } else if (~text.indexOf(conf.language.writemessage)) {
                        this.changeStatusTelegram(chatId, 1);
                    } else if (~text.indexOf(conf.language.back)) {
                        this.changeStatusTelegram(chatId, 0);
                    } else if (msg.reply_to_message) {
                        if (msg.reply_to_message.text == conf.language.enterlogin) {
                            this.chatlogin.set(chatId, text);
                            this.bot.sendMessage(chatId, conf.language.enterpswdhtml, conf.optforce);
                        } else if (msg.reply_to_message.text == conf.language.enterpswd) {
                            this.db.checkPswd(this.chatlogin.get(chatId), text).then((result) => {
                                result.forEach((row) => {
                                    if (row['col'] == 0) {
                                        this.bot.sendMessage(chatId, conf.language.error,{parse_mode : "HTML"});
                                        this.startMenuTelegram(chatId, conf.language.auth);
                                    } else {
                                        this.checkLoginTelergam(row['id'], chatId);
                                        login = row['id'];
                                    }
                                })
                            });
                        }
                    } else if (status == 1) {
                        var username = login;
                        var message = text;
                        var room = hash('id'+username + conf.secretkey).toString();
                        this.newMessageFromTelegram({ username, message, room});
                    }
                }
            })
        });	
    }
    queryTelegram(query) {
        const chatId = query.message.chat.id;
        if (query.data === 'contacts') {
            this.bot.sendMessage(chatId, conf.techcontacts,{parse_mode : "HTML"});
        }
    }
}