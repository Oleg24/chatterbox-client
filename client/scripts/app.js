// YOUR CODE HERE:

var app = {
  blockedUsers: [],
  friends: [],
  rooms: ['General'],
  currentRoom: 'General',
  init: function(){
    $('#main').on('click', '.username', function(event) {
      var username = event.currentTarget.dataset.username;
      $('#user_input').val(username);
    });
    $('#block_user').on('click', function(event) {
      var username = $('#user_input').val();
      var nodeRemove = username.replace(/ /g, '');
      app.blockedUsers.push(nodeRemove);
      $('#user_input').val("");
      $('.' + nodeRemove).remove();
    });
    $('.dropdown-menu').on('click', 'li', function(event) {
      var room_name = event.currentTarget.id;
      app.currentRoom = room_name;
    });
    $('#add_friend').on('click', function() {
      var username = $('#user_input').val();
      var nodeFriend = username.replace(/ /g, '');
      app.friends.push(nodeFriend);
      $('#user_input').val("");
    })
    $('#add_room').on('click', function() {
      var roomname = $('#user_input').val();
      app.rooms.push(roomname);
      ChatRoom(roomname);
      $('#user_input').val("");
    })
    $('#submit_message').on('click', function(event){
      var message = $('#message_input').val();
      $('#message_input').val("");
      app.handleSubmit(message);
    });
    $('#message_input').on('keydown', function(event){
      if (event.keyCode !== 13) {
        return;
      }
      var message = $('#message_input').val();
      $('#message_input').val("");
      app.handleSubmit(message);
    });
  },
  send: function(message){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function(data){
      },
      error: function(data){
      }
    });
  },
  fetch: function(url){
    $.ajax({
      url: url,
      type: 'GET',
      data: {order: "createdAt", count: 20},
      contentType: 'application/json',
      success: function(data){
        _.forEach(data.results, function(messageObj){
          app.addMessage(messageObj);
        });
      },
      error: function(data){
      }
    });
  },
  clearMessages: function(){
    $('#chats').children().remove();
  },
  addMessage: function(message){
    if(message.text === undefined || message.username === undefined || app.blockedUsers.indexOf(message.username.replace(/ /g, '')) >= 0){
      return;
    }
    message.username = message.username.replace(/<\/script>|<style>|<\/style>|<script>|<img/g, '');
    message.username = message.username.replace(/%20/g, ' ');
    message.text = message.text.replace(/<\/script>|<\/style>|<style>|<script>|<img/g, '');
    if (message.roomname === undefined || message.roomname.length <= 2) {
      message.roomname = "General";
    }
    if (app.rooms.indexOf(message.roomname) === -1) {
      app.rooms.push(message.roomname);
      ChatRoom(message.roomname);
    }
    var strong = ['', '']
    if (app.friends.indexOf(message.username) >= 0) {
      strong[0] = '<strong>';
      strong[1] = '</strong>';
    }
    if (app.currentRoom !== message.roomname) {return;}
    var node = $('<div class="messages username well well-small ' + message.username.replace(/ /g, '') + '" data-username="' + message.username + '">' + strong[0] + message.username + ": " + message.text + strong[1] + '</div>');
    $('#chats').prepend(node);
    node.addClass('slideRight');
  },
  addRoom: function(room) {
    var chat_room = $('<div class="chatroom" id="' + room + '"></div>');
    $('#roomSelect').append(chat_room);
  },
  addFriend: function(friend) {

  },
  handleSubmit: function(text){
    var message = {
      username: window.location.search.slice(window.location.search.indexOf('=') + 1),
      text: text
    };
    console.log(window.location.search.slice(window.location.search.indexOf('=') + 1));
    app.addMessage(message);
    app.send(message);
  },
};


