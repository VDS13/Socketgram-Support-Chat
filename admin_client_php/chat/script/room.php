<?php
    require_once "../../config/const.php";
    $room = $_POST['username'];
    echo hashroom('id'.$room.SECRET_KEY);
