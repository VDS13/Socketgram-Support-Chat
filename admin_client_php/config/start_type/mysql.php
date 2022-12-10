<?php
    function chat_link() {
        $db_host = HOST_CHAT;
        $db_user = USER_CHAT;
        $db_name = DB_CHAT;
        $db_passwd = PSWD_CHAT;
        $link = mysqli_connect($db_host, $db_user, $db_passwd, $db_name ) or die("Can't connect to database");
        $link->query("set names utf8mb4");
        return $link;
    }
    function start_page() {
        $link = chat_link();
        $query = 'SELECT m.id, m.cid, ac.name as aid, m.direction, m.date, m.message FROM messages m
            LEFT JOIN adm_account ac ON ac.aid = m.aid 
            WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) ORDER BY cid, m.id';
        $result = $link->query($query);
        if (!$result) {
            echo 0;
            exit;
        }
        $suparray = array();
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $suparray[] = $row;  
        }
        mysqli_close($link);
        return $suparray;
    }
    function cid_info() {
        $link = chat_link();
        $query = 'SELECT DISTINCT m.cid FROM messages m
            WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) ORDER BY cid';
        $result = $link->query($query);
        if (!$result) {
            echo 0;
            exit;
        }
        $suparray = array();
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $suparray[] = $row['cid'];  
        }
        mysqli_close($link);
        return $suparray;
    }
    function check_admin() {
        session_start();
        $link = chat_link();
        if (SUPER_USER == $_SESSION['verif_id']) {
            $res = -1;
        } else {
            $res = 0;
        }
        $query = 'SELECT count(*) AS col, lid FROM adm_account
            WHERE aid = "'.$_SESSION['verif_id'].'"';
        $result = $link->query($query);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        mysqli_close($link);
        if ($row['col'] != 0)
            return $row['lid'];
        return $res;
    }
    function create_user($login, $name, $role) {
        $link = chat_link();
        $stmt = $link->prepare("SELECT count(*) FROM adm_account WHERE aid = ?");
        $stmt->bind_param('s', $login);
        $stmt->execute();
        $stmt->bind_result($row);
        $stmt->fetch();
        if ($row == 1) {
            $stmt->close();
            $link->close();
            return 3;
        }
        $stmt->close();
        $stmt = $link->prepare("INSERT INTO adm_account(aid, name, lid) VALUES(?, ?, ?)");
        $stmt->bind_param('ssi', $login, $name, $role);
        $stmt->execute();
        $stmt->close();
        $link->close();
        return 1;
    }