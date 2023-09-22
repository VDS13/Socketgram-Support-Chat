<?php
    session_start();
    require_once "config/const.php";
    if (empty($_SESSION['verif_id']) || $_SESSION['verif_id'] == "") {
        require_once "../config/const.php";
        header("Location: ".DOMEN."authentification/");
    } else {
      require_once START_PAGE;
    }
    ?>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Administration PA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="shortcut icon" href="<?php echo LOGO_COMPANY_SVG; ?>" type="image/svg+xml" width=50px>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&amp;family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
        <link rel="stylesheet" href="style/css/new.css">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.10/jquery.mask.js"></script>
        <script src="js/my.js?020"></script>
        <script src="config/const.js?020"></script>
    </head>
    <body class="bg-light">
      <main class="text-center">
        <div class="container">
          <div id="login" class="row justify-content-center ">
            <div class="col-8 col-md-6 col-lg-5 col-xl-4">
              <div class="border rounded shadow-sm py-4 px-4 px-lg-5">
                <div style="width: 91px; height: 91px;" class="mx-auto"><img src="<?php echo LOGO_COMPANY; ?>"
                    class="mb-3 mx-auto img-fluid"> </div>
                <fieldset class="mb-3 row">
                  <legend class="col-form-legend col-sm-1-12">Administration PA</legend>
                  <legend class="col-form-legend col-sm-1-12"><?php echo COMPANY; ?></legend>
                </fieldset>
                <?php if ($_SESSION['role'] == 1 || $_SESSION['role'] == 2) : ?>
                <button type="button" class="btn btn-lg btn-outline-dark" id="button_сhat">Chat PA</button>
                <br>
                <?php endif; ?>
                <?php if ($_SESSION['role'] == -1 || $_SESSION['role'] == 1) : ?>
                <button type="button" class="btn btn-lg btn-outline-dark" id="button_createadmin">Create admin</button>
                <?php endif; ?>
                <?php if ($_SESSION['role'] == 0) : ?>
                  <div class="alert alert-danger" id="err_msg">You have no use rights.</div>
                <?php endif; ?>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="pt-3 text-muted text-center text-small">
        <a href="https://github.com/VDS13/socket-io-telegram-chat-support/"> <span class="nav-link px-3">Project page</span></a>
      </footer>
      </div>
    </body>
</html>