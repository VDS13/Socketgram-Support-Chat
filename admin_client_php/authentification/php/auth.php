<?php
    session_start();
    require_once "../../config/const.php";
    require LOG_IN;
    $login = $_POST["login"];
    $passwd = $_POST["passwd"];

    $auth = new Log_in($login, $passwd);
    if ($_POST["passwd"] && $_POST["login"]) {
        if ($passwd) {
            $res = $auth->auth();
            if ($res == 1) {
                require_once "../../".START_PAGE;
                $_SESSION["verif_id"] = $login;
                $_SESSION["role"] = check_admin();
                echo 0;
            }
            else {
                echo 1;
                $_SESSION = array();
                dropsession();
            }
        }
        else {
            echo 2;
            $_SESSION = array();
            dropsession();
        }
    }
    else {
        echo 2;
        $_SESSION = array();
        dropsession();
    }
    
