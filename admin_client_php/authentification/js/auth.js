$(document).ready(function(){
    $("#button_send_letter").click(function(){
        auth();
    });
    $('#password').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            auth();
        }
    });
    function auth() {
        document.getElementById('username').style = 'border: 1px solid #ccc;';
        document.getElementById('password').style = 'border: 1px solid #ccc;';
        var z = document.getElementById("err_msg");
        z.style.display = "none";
        if (document.getElementById("username").value == '') {
            document.getElementById("err_msg").innerHTML = "<em>Not all fields are filled</em>";
            document.getElementById("err_msg").style.display = "block";
            document.getElementById('username').style = 'border: 2px solid red;';
        }
        else if (document.getElementById("password").value == '') {
            document.getElementById("err_msg").innerHTML = "<em>Not all fields are filled</em>";
            document.getElementById("err_msg").style.display = "block";
            document.getElementById('password').style = 'border: 2px solid red;';
        }
        else {
            $.post("php/auth.php", { login : encodeURIComponent(document.getElementById("username").value), passwd: encodeURIComponent(document.getElementById("password").value)},
                function(data) {
                    if (data == 1) {
                        document.getElementById("err_msg").innerHTML = "<em>Wrong password or login</em>";
                        document.getElementById("err_msg").style.display = "block";
                    }
                    else if (data == 0) {
                        location.href = DOMEN;
                    } else {
                        document.getElementById("err_msg").innerHTML = "<em>Error, contact the administrator.</em>";
                        document.getElementById("err_msg").style.display = "block";
                    }
                } 
            );
        }
    }
});
