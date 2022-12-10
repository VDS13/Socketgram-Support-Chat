const conf = require("../../config/conf.js");
const mysql = require('mysql2/promise');


module.exports = class MysqlDB {
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
	async subsctibe(data) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [data.username];
		const sql = "SELECT * FROM (SELECT * FROM messages WHERE cid = ? ORDER BY id DESC LIMIT 20) t ORDER BY id";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async setChatName() {
		const connection = await mysql.createConnection(conf.db);
		const sql = "SELECT aid, name FROM adm_account";
		const result = await connection.query(sql);
		await connection.end();
		return result[0];
	}
	async addHistoryButton(data) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [data.username];
		const sql = "SELECT count(*) AS col, cid FROM messages WHERE cid = ?";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async addHistoryButtonMid(data) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [data.username, data.mid];
		const sql = "SELECT count(*) AS col, cid FROM messages WHERE cid = ? and id < ?";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async newMessageFromUser(data) {
		const connection = await mysql.createConnection(conf.db);
		let tmp = [data.username, 0, 1, this.timeNow(), data.message, 1, 0];
		let sql = "INSERT INTO messages(cid, aid, direction, date, message, check_msg, check_msg_admin) VALUES(?, ?, ?, ?, ?, ?, ?)";
		await connection.query(sql, tmp, true);
		const temp = [data.username];
		sql = "SELECT * FROM messages WHERE cid = ? ORDER BY id DESC LIMIT 1";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async newMessageFromAdmin(data) {
		const connection = await mysql.createConnection(conf.db);
		let tmp = [data.username, data.adm, 2, this.timeNow(), data.message, 0, 1];
		let sql = "INSERT INTO messages(cid, aid, direction, date, message, check_msg, check_msg_admin) VALUES(?, ?, ?, ?, ?, ?, ?)";
		await connection.query(sql, tmp, true);
		const temp = [data.username];
		sql = "SELECT * FROM messages WHERE cid = ? ORDER BY id DESC LIMIT 1";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async newMessageToTelegram(data) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [data.username];
		const sql = "SELECT IFNULL(chat_id,0) AS chat_id, count(*) AS col FROM telegram where cid=?";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async newMessageFromTelegram(data) {
		const connection = await mysql.createConnection(conf.db);
		let tmp = [data.username, 0, 1, this.timeNow(), data.message, 1, 0];
		let sql = "INSERT INTO messages(cid, aid, direction, date, message, check_msg, check_msg_admin) VALUES(?, ?, ?, ?, ?, ?, ?)";
		await connection.query(sql, tmp, true);
		const temp = [data.username];
		sql = "SELECT * FROM messages WHERE cid = ? ORDER BY id DESC LIMIT 1";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async takeHistory(data) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [data.username, data.mid];
		const sql = "SELECT * FROM messages WHERE cid = ? and id < ?  ORDER BY id DESC LIMIT 10";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async startServerSTCS() {
		const connection = await mysql.createConnection(conf.db);
		const sql = "SELECT chat_id, status FROM telegram";
		const result = await connection.query(sql);
		await connection.end();
		return result[0];
	}
	async startTelegram(msg) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [msg.chat.id];
		const sql = 'SELECT IFNULL(cid,0) AS cid, count(*) AS col FROM telegram WHERE chat_id = ?';
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async changeStatusTelegram(chatId, status) {
		const connection = await mysql.createConnection(conf.db);
		const sql = "UPDATE telegram SET status = ? where chat_id = ?";
		let temp = [status, chatId];
		await connection.query(sql, temp, true);
		await connection.end();
	}
	async checkLoginTelergam(id) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [id];
		const sql = "SELECT IFNULL(chat_id,0) AS chat_id, count(*) AS col FROM telegram where cid = ? ";
		const result = await connection.query(sql, temp);
		await connection.end();
		return result[0];
	}
	async updateLoginTelegram(oldl, newl) {
		const connection = await mysql.createConnection(conf.db);
		let temp = [newl, oldl];
		let sql = "UPDATE telegram SET chat_id = ? and status = 0 where chat_id = ?";
		await connection.query(sql, temp, true);
		await connection.end();
	}
	async loginTelergam(id, chatId) {
		const connection = await mysql.createConnection(conf.db);  
		let temp = [id, chatId, 0];
		let sql = "INSERT INTO telegram(cid, chat_id, status) VALUES(?, ?, ?)";
		await connection.query(sql, temp, true);
		await connection.end();
	}
	async messageTelegram(msg) {
		const connection = await mysql.createConnection(conf.db);
		const temp = [msg.chat.id];
		const sql = "SELECT IFNULL(status, 0) as status, IFNULL(cid, 0) as cid, count(*) AS col FROM telegram where chat_id = ?";
		const result = await connection.query(sql,temp);
		await connection.end();
		return result[0];
	}
	async checkPswd(login, pswd) {
		var connection;
		var sql;
		var temp;
		if (conf.hashpswd !== '') {
			const hash = require("crypto-js/"+conf.hashpswd);
			temp = [login, hash(pswd)];
		} else {
			temp = [login, pswd];
		}
		if (conf.auth !== '') {
			sql = conf.auth;
			connection = await mysql.createConnection(conf.dbadmin);
		} else {
			sql = 'SELECT count(*) AS col, id FROM users WHERE concat("id",id) = ? AND password = ?';
			connection = await mysql.createConnection(conf.db);
		}
		const result = await connection.query(sql,temp);
		await connection.end();
		return result[0];
	}
	
}