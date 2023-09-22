$(document).ready(function(){
    $("#button_create").click(function(){
        create();
    });
    $('#role').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            create();
        }
    });
    function create() {
        document.getElementById('login').style = 'border: 1px solid #ccc;';
        document.getElementById('name').style = 'border: 1px solid #ccc;';
        document.getElementById('role').style = 'border: 1px solid #ccc;';
        var z = document.getElementById("err_msg");
        z.style.display = "none";
        if (document.getElementById("login").value == '') {
            document.getElementById("err_msg").innerHTML = "<em>Not all fields are filled</em>";
            document.getElementById("err_msg").style.display = "block";
            document.getElementById('login').style = 'border: 2px solid red;';
        }
        else if (document.getElementById("name").value == '') {
            document.getElementById("err_msg").innerHTML = "<em>Not all fields are filled</em>";
            document.getElementById("err_msg").style.display = "block";
            document.getElementById('name').style = 'border: 2px solid red;';
        }
        else if (document.getElementById("role").value == '') {
            document.getElementById("err_msg").innerHTML = "<em>Not all fields are filled</em>";
            document.getElementById("err_msg").style.display = "block";
            document.getElementById('role').style = 'border: 2px solid red;';
        }
        else {
            $.post("php/create.php", {
                login : encodeURIComponent(document.getElementById("login").value),
                name: encodeURIComponent(document.getElementById("name").value),
                role: encodeURIComponent(document.getElementById("role").value),
            },
                function(data) {
                    if (data == 2) {
                        document.getElementById("err_msg").innerHTML = "<em>Wrong data</em>";
                        document.getElementById("err_msg").style.display = "block";
                    } else if (data == 3) {
                        document.getElementById("err_msg").innerHTML = "<em>Admin already created</em>";
                        document.getElementById("err_msg").style.display = "block";
                    } else if (data == 1) {
                        alert('Admin created');
                        const socket = io(DOMEN_SERVER, { transports : ['websocket', 'polling', 'flashsocket'], query : {[SERVER_KEY]: SERVER_PSWD}  });
                        socket.emit('update admlist');
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
