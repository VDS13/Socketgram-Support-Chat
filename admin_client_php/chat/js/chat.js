const socket = io(DOMEN_SERVER, { transports : ['websocket', 'polling', 'flashsocket'], query : {[SERVER_KEY]: SERVER_PSWD}  });

socket.on('new message', (data) => {
    addChatMessage(data);
});
socket.on('online', (data) => {
    if ($('#status'+data.cid).length)
        document.getElementById("status" + data.cid).innerHTML = '<i class="fa fa-circle online"></i> online';
});
socket.on('offline', (data) => {
    if ($('#status'+data.cid).length)
        document.getElementById("status" + data.cid).innerHTML = '<i class="fa fa-circle offline"></i> offline';
});
const addChatMessage = (data) => {
    var div;
    var user;
    if (data.adm == 0) {
        div = '<li class="clearfix" data-mid="'+data.label+'"><div class="message-data "><span class="message-data-time">id'+ data.username + ' ' + data.date + '</span><img src="'+ DOMEN +'chat/css/piccl.png"></div><div class="message my-message">' + data.message +'</div></li>';
        user = data.username;
    }  else {
        div = '<li class="clearfix" data-mid="'+data.label+'"><div class="message-data text-right"><span class="message-data-time">' + data.adm + ' ' + data.date + '</span><img src="'+ DOMEN +'chat/css/techhelp.png"></div><div class="message other-message float-right">' + data.message +'</div></li>';
        user = data.username;
    }
    if ($('#id'+data.username).length) {
        $('.ul'+user).append(div);
        $('.ul'+user).scrollTop( $('.ul'+user).prop('scrollHeight'));
    } else {
        $.post("script/room.php", { username : data.username},
            function(res) {
                var newli = '<li id="navli' + data.username + '" class="navli clearfix" onclick=dispnone(' + data.username + ',"' + res + '")><img src="'+ DOMEN + LOGO_COMPANY +'"><div class="about"><div class="name">id' + data.username + '</div><div class="status" id="status'+ data.username +'"><i class="fa fa-circle online"></i> online</div></div></li>';
                $('.chat-list').append(newli);
                var newchat;
                newchat = '<div class="ids" id="id'+ data.username +'" style="display: none;">';
                newchat = newchat + '<div class="chat-header clearfix"><div class="row"><div class="col-lg-6"><a href="javascript:void(0);" data-toggle="modal" data-target="#view_info"><img src="'+ DOMEN + LOGO_COMPANY +'"></a>';
                newchat = newchat + '<div class="chat-about"><h6 class="m-b-0">id'+ data.username +'</h6></div></div><div class="col-lg-6 hidden-sm text-right"></div></div></div>';
                newchat = newchat + '<div class="chat-history"><ul class="chatul m-b-0 ul' + data.username + '"></ul></div>';
                newchat = newchat + '<div class="chat-message clearfix"><div class="input-group mb-0"><div class="input-group-prepend"><button class="btn btn-outline-secondary" onclick="send(' + data.username + ',"' + res + '")"><span><i class="fa fa-send"></i></button></div>';
                newchat = newchat + '<input type="text" class="form-control msg' + data.username + '" placeholder="Enter text here..."</div></div></div>';
                $('#chat').append(newchat);
                $('.ul'+user).append(div);
                $('.ul'+user).scrollTop( $('.ul'+user).prop('scrollHeight'));
            });
    }
}
const dispnone = (str, room) => {
    sessionStorage.setItem("id", str);
    sessionStorage.setItem("room", room);
    var elems=document.getElementsByClassName('ids');
    var navli=document.getElementsByClassName('navli');
    for(var i=0; i<elems.length; i++)elems[i].style.display='none';
    for(var i=0; i<navli.length; i++) {
        if (navli[i].classList.contains('active')) {
            navli[i].classList.remove("active");
        }
    }
    socket.emit('subscribe:servadm', {room: room, adm: sessionStorage.getItem("adm_chat")});
    document.getElementById('id'+str).style.display = 'block';
    $('.ul'+str).scrollTop( $('.ul'+str).prop('scrollHeight')) ;
    document.getElementById('navli'+str).classList.add("active");
}
const send = (username, room) => {
    let message = $('.msg'+username).val();
    if (message) {
        $('.msg'+username).val('');
        adm = sessionStorage.getItem("adm_chat");
        socket.emit('new message:servadm', { username: username, message, room, adm});
    }
}
$(window).keydown(event => {
    if (event.which === 13 && !event.shiftKey) {
        send(sessionStorage.getItem("id"),sessionStorage.getItem("room"));
    }
});
    