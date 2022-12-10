<?php
    session_start();
    if (empty($_SESSION['verif_id']) || $_SESSION['verif_id'] == "" || $_SESSION['role'] == 0 || $_SESSION['role'] == 2) {
        require_once "../config/const.php";
        header("Location: ".DOMEN."authentification/");
    } else {
        require_once "../config/const.php";
    }
?>
<html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="description" content="Authorization in the admin panel">
        
          <title>Authorization in the admin panel</title>
        
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link href="css/new.css" rel="stylesheet">
          <link rel="shortcut icon" href="../<?php echo LOGO_COMPANY_SVG; ?>" type="image/svg+xml" width=50px>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&amp;family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
          <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.10/jquery.mask.js"></script>
          <script src="js/createadmin.js?010"></script>
          <script src="../config/const.js?010"></script>
        </head><span id="warning-container"><i data-reactroot=""></i></span>
        
        <body class="bg-light">
          <main class="text-center">
            <div class="container">
              <div class="row justify-content-center ">
                <div class="col-8 col-md-6 col-lg-5 col-xl-4">
                  <form class="border rounded shadow-sm py-4 px-4 px-lg-5" method="post">
                    <div style="width: 91px; height: 91px;" class="mx-auto"><img src="../<?php echo LOGO_COMPANY; ?>"
                        class="mb-3 mx-auto img-fluid"> </div>
                    <fieldset class="mb-3 row">
                      <legend class="col-form-legend col-sm-1-12">Create admin</legend>
                      <legend class="col-form-legend col-sm-1-12"><?php echo COMPANY; ?></legend>
                    </fieldset>
                    <div class="mb-3 ">
                      <label for="" class="form-label">Login</label>
                      <div class="row mx-auto">
                        <div class="col-2 my-auto g-0"><i class="bi bi-person " style="font-size: 24px;"></i></div>
                        <div class="col-8 g-0"> <input type="text" class="form-control" name="" id="login" aria-describedby="helpId"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="" class="form-label">Name</label>
                      <div class="mb-3 row mx-auto">
                        <div class="col-2 my-auto g-0"> <i class="bi bi-info" style="font-size: 24px;"></i></div>
                        
                        <div class="col-8 g-0"><input type="text" class="form-control" name="" id="name" placeholder=""></div>    
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="" class="form-label">Role</label>
                      <div class="mb-3 row mx-auto">
                        <div class="col-2 my-auto g-0"> <i class="bi bi-gear" style="font-size: 24px;"></i></div>
                        
                        <div class="col-8 g-0"><input type="text" class="form-control" name="" id="role" placeholder="1 or 2"></div>    
                      </div>
                    </div>
                    <div class="alert alert-danger" id="err_msg" style="display: none;"></div>
                    <button type="button" class="btn btn-lg btn-outline-dark" id="button_create">Create</button>
                  </form>
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