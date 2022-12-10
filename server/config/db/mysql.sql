	use `chat`;
	ALTER DATABASE `chat` DEFAULT CHARACTER SET utf8mb4;
	create table users (
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
		`login_another_db` varchar(256),
		`password` varchar(256) NOT NULL
	);
	create table telegram (
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
		`cid` int(10) unsigned NOT NULL,
		`chat_id` int(10) NOT NULL,
		`status` int(10) NOT NULL
	);
	create table messages (
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
		`cid` int(10) unsigned NOT NULL,
		`aid` varchar(20) NOT NULL,
		`direction` int(10) NOT NULL,
		`date` datetime NOT NULL,
		`message` varchar(10000) DEFAULT NULL,
		`check_msg` int(10) NOT NULL,
		`check_msg_admin` int(10) NOT NULL
	);
	create table adm_account (
		`aid` varchar(20) NOT NULL PRIMARY KEY,
		`name` varchar(20) NOT NULL,
		`lid` int(10) NOT NULL
	);
	ALTER TABLE `messages` ADD FOREIGN KEY (aid) REFERENCES `adm_account`(aid);
	ALTER TABLE `messages` ADD FOREIGN KEY (cid) REFERENCES `users`(id);
	ALTER TABLE `telegram` ADD FOREIGN KEY (cid) REFERENCES `users`(id);
