$(document).ready(function(){
    const $window = $(window);
    const $inputMessage = $('.inputMessage');
    const socket = io(DOMEN_SERVER, { transports : ['websocket', 'polling', 'flashsocket'], query : 'id='+sessionStorage.getItem("id")+"&room="+sessionStorage.getItem("room")  });
    let room = sessionStorage.getItem("room");
    let username = sessionStorage.getItem("id");
    socket.emit('subscribe', {room, username});
        
    const sendMessage = () => {
        let message = $inputMessage.val();
        let username = sessionStorage.getItem("id");
        let room = sessionStorage.getItem("room");
        if (message) {
            $inputMessage.val('');
            socket.emit('new message', { username, message, room });
        }
    }
    const addChatMessage = (data, options = {}) => {
        var div;
        if (data.adm != 0) {
            div = '<li class="clearfix" data-mid="'+data.label+'"><div class="message-data "><img src="'+ DOMEN +'style/piccl.png"><span class="message-data-time">'+ data.adm + ' ' + data.date + '</span></div><div class="message my-message">' + data.message +'</div></li>';
        }  else {
            div = '<li class="clearfix" data-mid="'+data.label+'"><div class="message-data text-right"><span class="message-data-time">id' + data.username + ' ' + data.date + '</span><img src="'+ DOMEN +'style/techhelp.png"></div><div class="message other-message float-right">' + data.message +'</div></li>';
        }
        $('.chat-list').append(div);
        $('.chat-list').scrollTop( $('.chat-list').prop('scrollHeight')) ;
    }
    const addChatMessageHistory = (data, options = {}) => {
        var div;
        if (data.adm != 0) {
            div = '<li class="clearfix" data-mid="'+data.label+'"><div class="message-data "><img src="'+ DOMEN +'style/piccl.png"><span class="message-data-time">'+ data.adm + ' ' + data.date + '</span></div><div class="message my-message">' + data.message +'</div></li>';
        }  else {
            div = '<li class="clearfix" data-mid="'+data.label+'"><div class="message-data text-right"><span class="message-data-time">id' + data.username + ' ' + data.date + '</span><img src="'+ DOMEN +'style/techhelp.png"></div><div class="message other-message float-right">' + data.message +'</div></li>';
        }
        $('.chat-list').prepend(div);
    }
    $window.keydown(event => {
        if (event.which === 13 && !event.shiftKey) {
            sendMessage();
        }
    });
    $('#sendmsg').click(() => {
        sendMessage();
    });
    $inputMessage.click(() => {
        $inputMessage.focus();
    });
    socket.on('new message', (data) => {
        addChatMessage(data);
    });
        
    socket.on('new message history', (data) => {
        addChatMessageHistory(data);
    });
        
    socket.on('drop history button', (data) => {
        $('.butlihistory').remove();
    });
        
    socket.on('add history button', () => {
        var div;
        div = '<li class="butlihistory"><button class="btn btn-light navbar-btn" id="takehistory" onclick="takehistory()">More msg</button></li>';
        $('.chat-list').prepend(div);
        $('.chat-list').scrollTop() 
    });
    
});
const takehistory = () => {
    const socket = io(DOMEN_SERVER, { transports : ['websocket', 'polling', 'flashsocket'], query : 'id='+sessionStorage.getItem("id")+"&room="+sessionStorage.getItem("room")});
    $('#takehistory').html('<img src="css/Loading.gif" width="30px" />');
    let username = sessionStorage.getItem("id");
    let room = sessionStorage.getItem("room");
    var mid = 50000000;
    $('.limsgmid').each(function() {
        var value = parseFloat($(this).attr('data-mid'));
        mid = (value < mid) ? value : mid;
    });
    socket.emit('take history', { username, room, mid });
}