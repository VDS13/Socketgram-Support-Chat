const fs = require('fs');
/**
 * Company name
 * @param {String} company 
*/
const company = 'Socketgram';

/**
 * Company contacts (HTML format)
 * @param {String} techcontacts
*/
const techcontacts = '<b>Technical support(round-the-clock):</b>\nPhone numbers:\n+1(234)567-89-12';

/**
 * Internet protocol
 * @param {String} protocol - http/https
*/
const protocol = 'https';
/**
 * Domen
 * @param {String} hostname
*/
const hostname = "your.domen.com";
/**
 * If https is selected, fill in the block below (paths to the certificate and private key)
*/
const key = '/etc/ssl/privkey.pem';
const cert = '/etc/ssl/cert.pem';
const sslconf = protocol === 'https' ?
    {
        hostname: hostname,    // Domen server
        key: fs.readFileSync(key),    // Path to file with PEM private key
        cert: fs.readFileSync(cert)   // Path to file with PEM certificate
    } : undefined;
/**
 * TCP/IP Port
 * @param {String|Number} port
*/
const port = 443;

/**
 * Message and bot menu language
 * @param {String} lang - ru/en
*/
const lang = 'ru';

/**
 * GMT timezone
 * @param {String|Number} time
*/
const time = 3;

/**
 * Secret key (used to form rooms)
 * @param {String} secretkey
*/
const secretkey = 'qwerty';

/**
 * Hash type for forming rooms
 * @param {String} hashtype
*/
const hashtype = 'md5';

/**
 * Password hash type
 * If hashing is not used, set the value to ''
 * @param {String} hashpswd
*/
const hashpswd = 'md5';

/**
 * Admin login name and key (admin socket definition)
 * @param {String} adminkey
 * @param {String} adminname
*/
const adminkey = 'admin';
const adminname = 'adminpass';

/**
 * Database type (currently MySQL only)
 * @param {String} dbtype - mysql/postgres/mongo
*/
const dbtype = 'mysql';

/**
 * Data to connect to the chat database
 * @param {Object} db
*/
const db = {
    host: "localhost",
    user: "server_chat",
    database: "chat",
    password: "yourpass"
};

/**
 * Data for connecting to the customer database (which stores user credentials)
 * If a schema with data import is used, this object is not used
 * @param {Object} dbadmin
*/
const dbadmin = {
    host: "192.168.1.1",
    user: "admin",
    database: "users",
    password: "yourpass"
};
/**
 * Request for user authentication in a third-party database (For example: 
 *     SELECT count(*) AS col, id FROM ur WHERE concat("id",id) = ? AND pswd = ?'
 * )
 * If a schema with data import is used, this variable is not populated
 * @param {String} auth
*/
const auth = '';

/**
 * Telegram token
 * @param {String} token
*/
const token = '0101010101:AAAAAAAAAAAAAAAAMQwQQwQQwQQwQQwQQwQ';

/**
 * Telegram bot operation method (false - WebHook, true - polling)
 * Note: Webhook only works on https protocol
 * @param {Object} tlgrm_option
*/

const tlgrm_option = {
    polling: false
};

/**
 * force reply option (default value)
 * @param {Object} optforce
*/
const optforce = {
    reply_markup:
        {
            force_reply: true
        },
        parse_mode : "HTML"
}

module.exports.techcontacts = techcontacts;
module.exports.protocol = protocol;
module.exports.auth = auth;
module.exports.dbtype = dbtype;
module.exports.db = db;
module.exports.dbadmin = dbadmin;
module.exports.token = token;
module.exports.secretkey = secretkey;
module.exports.adminkey = adminkey;
module.exports.adminname = adminname;
module.exports.sslconf = sslconf;
module.exports.optforce = optforce;
module.exports.port = port;
module.exports.time = time;
module.exports.hashtype = hashtype;
module.exports.hashpswd = hashpswd;
module.exports.company = company;
module.exports.tlgrm_option = tlgrm_option;
module.exports.language = require("./language/"+ lang + ".js");