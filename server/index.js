const Socketgram = require("./src/server.js");
const stcs = new Socketgram();
stcs.startSocketgram();
stcs.io.on('connection', (socket) => {
	stcs.socketConnection(socket);
});
stcs.bot.onText(/\/start/, (msg) => {
	stcs.startTelegram(msg);
});
stcs.bot.on('callback_query', (query) => {
	stcs.queryTelegram(query);
});
stcs.bot.on('message', (msg) => {
	stcs.messageTelegram(msg);
});