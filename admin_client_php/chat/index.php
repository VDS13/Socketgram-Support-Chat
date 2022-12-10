<?php
    session_start();
    if (empty($_SESSION['verif_id']) || $_SESSION['verif_id'] == "" || $_SESSION['role'] == 0 || $_SESSION['role'] == -1) {
        require_once "../config/const.php";
        header("Location: ".DOMEN."authentification/");
    } else {
        require_once "../config/const.php";
    }
?>
<html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Сhat <?php echo COMPANY; ?></title>
            <link rel="shortcut icon" href="../<?php echo LOGO_COMPANY_SVG; ?>" type="image/svg+xml" width=50px>
            <link rel="stylesheet" href="css/chat.css" type="text/css" media="screen" />
            <script src="<?php echo SOCKETIO; ?>"></script>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.bundle.min.js"></script>
            <script src="../config/const.js?010"></script>
            <script type="text/javascript" src="js/chat.js?010"></script>
        </head>
        <body>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
            <div class="container">
                <?php
                    require_once "../".START_PAGE;
                    $info = array();
                    $info = cid_info();
                    $nonmsg = '';
                    if (!empty($info)) {
                        $flag = 0;
                        $chat = array();
                        $chat = start_page();
                    } else {
                        $nonmsg = "There have been no messages in the last month.";
                    }
                ?>
                <?php if ($nonmsg === "") :?>
                    <script> sessionStorage.setItem("adm_chat", "<?php echo $_SESSION['verif_id']; ?>"); </script>
                    <div id="row" class="row clearfix">
                        <div class="card chat-app">
                            <div id="plist" class="people-list">
                                <ul class="list-unstyled chat-list mt-2 mb-0">
                                    <?php foreach ($info as $key => $val) : ?>
                                        <?php if ($key == 0) : ?>
                                            <li id="navli<?php echo $val; ?>" class="navli clearfix active" onload=dispnone(<?php echo $val.',"'.hashroom('id'.$val.SECRET_KEY).'"'; ?>) onclick=dispnone(<?php echo $val.',"'.hashroom('id'.$val.SECRET_KEY).'"'; ?>)>
                                                <img src="<?php echo DOMEN.LOGO_COMPANY; ?>">
                                                <div class="about">
                                                    <div class="name">
                                                        id<?php echo $val; ?>
                                                    </div>
                                                    <div class="status" id="status<?php echo $val; ?>">
                                                        <i class="fa fa-circle offline"></i>
                                                        offline
                                                    </div>  
                                                </div>
                                            </li>
                                        <?php else: ?>
                                            <li id="navli<?php echo $val; ?>" class="navli clearfix" onclick=dispnone(<?php echo $val.',"'.hashroom('id'.$val.SECRET_KEY).'"'; ?>)>
                                                <img src="<?php echo DOMEN.LOGO_COMPANY; ?>">
                                                <div class="about">
                                                    <div class="name">
                                                        id<?php echo $val; ?>
                                                    </div>
                                                    <div class="status" id="status<?php echo $val; ?>">
                                                        <i class="fa fa-circle offline"></i>
                                                        offline
                                                    </div> 
                                                </div>
                                            </li>
                                        <?php endif; ?>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                            <div class="chat" id="chat">
                                <?php
                                    foreach ($chat as $key => $row) { 
                                        if ($flag == 0) {
                                            $flag = $row['cid'];
                                ?>
                                <div class="ids" id="id<?php echo $row['cid']; ?>">
                                    <div class="chat-header clearfix">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                    <img src="<?php echo DOMEN.LOGO_COMPANY; ?>">
                                                </a>
                                                <div class="chat-about">
                                                    <h6 class="m-b-0">
                                                        id<?php echo $row['cid']; ?>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 hidden-sm text-right"></div>
                                        </div>
                                    </div>
                                    <div class="chat-history">
                                        <ul class="chatul m-b-0 ul<?php echo $row['cid']; ?>">
                                    <?php
                                        }
                                        if ($flag == $row['cid']) {
                                            if ($row['direction'] == 1) {
                                    ?>
                                            <li class="clearfix" data-mid="<?php echo $row['id']; ?>">
                                                <div class="message-data">
                                                    <img src="<?php echo DOMEN; ?>chat/css/piccl.png">
                                                    <span class="message-data-time">
                                                        id<?php echo $row['cid']; ?> <?php echo date("Y-m-d H:i:s",strtotime($row['date'])); ?>
                                                    </span>
                                                </div>
                                                <div class="message my-message">
                                                    <?php echo $row['message']; ?>
                                                </div>
                                            </li>
                                    <?php
                                            } else {
                                    ?>
                                            <li class="clearfix" data-mid="<?php echo $row['id']; ?>">
                                                <div class="message-data text-right">
                                                    <span class="message-data-time">
                                                        <?php echo $row['aid']; ?> <?php echo COMPANY; ?> <?php echo date("Y-m-d H:i:s",strtotime($row['date'])); ?>
                                                    </span>
                                                    <img src="<?php echo DOMEN; ?>chat/css/techhelp.png">
                                                </div>
                                                <div class="message other-message float-right">
                                                    <?php echo $row['message']; ?>
                                                </div>
                                            </li>
                                    <?php
                                            }
                                        }
                                        if ($flag != $row['cid'] && $flag != 0) {
                                    ?>
                                        </ul>
                                    </div>
                                    <div class="chat-message clearfix">
                                        <div class="input-group mb-0">
                                            <div class="input-group-prepend">
                                                <button class="btn btn-outline-secondary" onclick=send(<?php echo $flag.',"'.hashroom('id'.$flag.SECRET_KEY).'"'; ?>)>
                                                <span>
                                                    <i class="fa fa-send"></i>
                                                </span>
                                            </div>
                                            <input type="text" class="form-control msg<?php echo $flag; ?>" placeholder="Enter text here...">
                                        </div>
                                    </div>
                                </div>
                                <div class="ids" id="id<?php echo $row['cid']; ?>" style="display: none;">
                                    <div class="chat-header clearfix">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                    <img src="<?php echo DOMEN.LOGO_COMPANY; ?>">
                                                </a>
                                                <div class="chat-about">
                                                    <h6 class="m-b-0">
                                                        id<?php echo $row['cid']; ?>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 hidden-sm text-right"></div>
                                        </div>
                                    </div>
                                    <div class="chat-history">
                                        <ul class="chatul m-b-0 ul<?php echo $row['cid']; ?>">
                                    <?php
                                            $flag = $row['cid'];
                                            if ($row['direction'] == 1) {
                                    ?>
                                            <li class="clearfix" data-mid="<?php echo $row['id']; ?>">
                                                <div class="message-data">
                                                    <img src="<?php echo DOMEN; ?>chat/css/piccl.png">
                                                    <span class="message-data-time">
                                                        id<?php echo $row['cid']; ?> <?php echo date("Y-m-d H:i:s",strtotime($row['date'])); ?>
                                                    </span>
                                                </div>
                                                <div class="message my-message">
                                                    <?php echo $row['message']; ?>
                                                </div>
                                            </li>
                                    <?php
                                            } else {
                                    ?>
                                            <li class="clearfix" data-mid="<?php echo $row['id']; ?>">
                                                <div class="message-data text-right">
                                                    <span class="message-data-time">
                                                        <?php echo $row['aid']; ?> <?php echo COMPANY; ?> <?php echo date("Y-m-d H:i:s",strtotime($row['date'])); ?>
                                                    </span>
                                                    <img src="<?php echo DOMEN; ?>chat/css/techhelp.png">
                                                </div>
                                                <div class="message other-message float-right">
                                                    <?php echo $row['message']; ?>
                                                </div>
                                            </li>
                                <?php
                                            }
                                        }
                                    }
                                ?>
                                    </ul>
                                </div>
                                <div class="chat-message clearfix">
                                    <div class="input-group mb-0">
                                        <div class="input-group-prepend">
                                            <button class="btn btn-outline-secondary" onclick=send(<?php echo $flag.',"'.hashroom('id'.$flag.SECRET_KEY).'"'; ?>)>
                                            <span>
                                                <i class="fa fa-send"></i>
                                            </span>
                                        </div>
                                        <input type="text" class="form-control msg<?php echo $flag; ?>" placeholder="Enter text here...">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php else: ?>
                    <h1><?php echo $nonmsg; ?></h1>
                <?php endif; ?>
            </div>
        </body>
</html>
