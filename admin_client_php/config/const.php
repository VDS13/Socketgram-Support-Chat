<?php
	/*************************Default parameters**********************************/
	define("SUPER_USER", 'VDS13');                                       //Superuser/administrator login
	define("SECRET_KEY", 'key');                                         //Secret key
	define("COMPANY", 'Socketgram');                                     //Company name
	define("LOGO_COMPANY", 'socketgram.io.min.png');                     //Company logo(PNG)
	define("LOGO_COMPANY_SVG", 'socketgram.io.svg');                     //Company logo(SVG)
	define("HASHTYPE", 'md5');                                           //Room hashing type
	define("DOMEN", 'http://test.com/');                                 //URL of the admin panel folder
	define("SOCKETIO", 'https://your.domen.com/socket.io/socket.io.js'); //URL of socket.io library on chat server
	
	/*************************Authentication**********************************/
	/*
	There are two types of authentication to choose from: LDAP and MySQL
	To run a specific type, you need to uncomment the desired 'LOG_IN' and enter constant values
	*/
	//////////////////////////LDAP Authentication////////////////////////////////
	define("LOG_IN",'../../config/auth_type/ldap.php');
	define("USER_LDAP", 'uid=reader,ou=people,dc=test');                 //LDAP reader-user qualifier
	define("PASSWORD_LDAP", 'superreader');                              //LDAP reader password
	define("HOST_LDAP", '192.168.1.1');                                  //LDAP server host
	define("PORT_LDAP", 389);                                            //LDAP server port
	define("BASEDB_LDAP", 'dc=test');                                    //Base DN
	define("GROUP_LDAP", 'cn=allow,ou=groups,o=socketgram,dc=test');     //LDAP user group with chat access
	
	//////////////////////////MySQL Authentication///////////////////////////////
	//define("LOG_IN",'../../config/auth_type/mysql.php');
	define('HOST_ADMIN', '192.168.2.6');                                 //Database IP host
	define('DB_ADMIN', 'admin');                                         //Database name
	define('USER_ADMIN', 'admin');                                       //Database user
	define('PSWD_ADMIN', 'qwerty');                                      //Database password
	define("HASHTYPE_ADMIN", 'md5');                                     //Administrator password hash type
	define(
		"MYSQL_QUERY_ADMIN",
		'SELECT COUNT(*) AS col FROM admin WHERE login = ? AND LOWER(password) = ?'
	);                                                                   //Query to check if an administrator exists in the database
	
	/*************************Chat server**********************************/
	/*
	At the moment the chat server only runs on MySQL
	*/
	//////////////////////////MySQL start config//////////////////////////////
	define("START_PAGE", 'config/start_type/mysql.php');
	define('HOST_CHAT', '192.168.3.3');                                  //Chat Server IP host
	define('DB_CHAT', 'chat');                                           //Chat Server Database name
	define('USER_CHAT', 'qqqqqqqq');                                     //Chat Server Database user
	define('PSWD_CHAT', 'ppppppppp');                                    //Chat Server Database password

	/*************************Defalft function**********************************/
	function hashroom($str) {
		return hash(HASHTYPE, $str);
	}
	function dropsession() {
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}
		session_destroy();
	}