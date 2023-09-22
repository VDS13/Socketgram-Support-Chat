<?php
    session_start();
    require_once "../../config/const.php";
    require_once "../../".START_PAGE;
    $login = $_POST["login"];
    $name = $_POST["name"];
    $role = $_POST["role"];

    if ($role == 1 || $role == 2) {
        $res = create_user($login, $name, $role);
        if ($_SESSION["verif_id"] == $login) {
            $_SESSION["role"] = $role;
        }
        echo $res;
    }
    else {
        echo 2;
    }
    
