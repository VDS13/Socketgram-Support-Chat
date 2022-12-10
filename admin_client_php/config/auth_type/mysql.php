<?php
    require_once "../../config/const.php";
    class Log_in {
        function __construct($login, $password) {
            $this->login = $login;
            $this->password = $password;
        }
        function linkDB() {
            $db_host = HOST_ADMIN;
            $db_user = USER_ADMIN;
            $db_name = DB_ADMIN;
            $db_passwd = PSWD_ADMIN;
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            $link = new mysqli($db_host, $db_user, $db_passwd, $db_name ) or die("Can't connect to database");
            $link->query("set names utf8");
		    return $link;
        }
        function auth() {
            $link = $this->linkDB();
            $stmt = $link->prepare(MYSQL_QUERY_ADMIN);
            $stmt->bind_param('ss', $this->login, hash(HASHTYPE_ADMIN, $this->password));
            $stmt->execute();
            $stmt->bind_result($row);
            $stmt->fetch();
            $stmt->close();
            $link->close();
            return $row;
        }
    }