// data stores current data
var data = {
  blockedUsers: [],
  friends: [],
  rooms: [],
  currentRoom: 'General',
  chats: {}
};
// server stores any functionality related to server interaction
var server = {
  send: function(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
    });
  },
  fetch: function(url) {
    $.ajax({
      url: url + '?order=-createdAt',
      type: 'GET',
      contentType: 'application/json',
      success: function(response) {
        _.forEach(response.results, function(messageObj) {
          var id = messageObj.objectId;
          if (data.chats[id] === undefined) {
            data.chats[id] = true;
            app.addMessage(messageObj);
          }
        });
      }
    });
  }
};

// buttonEvents stores any functionality related to event handlers
var buttonEvents = {
  init: function() {
    // change username field to targeted username on click so userInput funciton can grab info
    $('#main').on('click', '.username', function(e) {
      var username = e.currentTarget.dataset.user;
      $('#user_input').val(username);
    });

    // event handlers on adding friends, rooms, or blocked users
    $('#block_user').on('click', function(e) {
      var user = buttonEvents.userInput(true, data.blockedUsers);
      $('.' + user).remove();
    });
    $('#add_friend').on('click', function() {
      buttonEvents.userInput(true, data.friends);
    })
    $('#add_room').on('click', function() {
      buttonEvents.userInput(false, data.rooms, ChatRoom)
    })

    //change to current room
    $('.dropdown-menu').on('click', 'li', function(e) {
      var room_name = e.currentTarget.id;
      data.currentRoom = room_name;
      app.switchRoom();
    });

    //send messages on click or enter
    $('#submit_message').on('click', function(e){
      buttonEvents.handleSubmit();
    });
    $('#message_input').on('keydown', function(e){
      if (e.keyCode !== 13) { return; }
      buttonEvents.handleSubmit();
    });
  },
  userInput: function(delSpace, arr, callback) {
    var value = delSpace ? $('#user_input').val().replace(/ /g, '') : $('#user_input').val();
    Array.prototype.push.call(arr, value);
    if (callback !== undefined) {
      callback(value);
    }
    $('#user_input').val("");
    return value;
  },
  handleSubmit: function() {
    var text = $('#message_input').val();
    var room = data.currentRoom;
    var message = {
      // grab current username and insert into object
      username: window.location.search.slice(window.location.search.indexOf('=') + 1),
      text: text,
      roomname: room
    };
    server.send(message);
    $('#message_input').val("");
  }
};

// app stores any functionality related to changing dom
var app = {
  addMessage: function(message) {
    var strong = ['', ''];
    var room = _.escape(message.roomname);
    var msg = _.escape(message.text);
    var user = _.escape(message.username);
    room = room.length === 0 ? "General" : room;
    msg = msg.length === 0 ? "Empty Message" : msg;
    user = user.length === 0 ? "Anon" : user.replace(/%20/g, ' ');

    //create new room if room does not exist
    if (data.rooms.indexOf(room) === -1) {
      ChatRoom(room);
    }
    // stop add message if user is blocked or the chat is not supposed to go into this room
    if (data.blockedUsers.indexOf(user.replace(/ /g, '')) >= 0 || data.currentRoom !== room) {
      return;
    }
    // if user is friended, bolds print
    if (data.friends.indexOf(user) >= 0) {
      strong[0] = '<strong>';
      strong[1] = '</strong>';
    }

    var node = $('<div class="messages username well well-small ' + user.replace(/ /g, '') + '" data-user="' + user + '">' + strong[0] + user + ": " + msg + strong[1] + '</div>');
    $('#chats').prepend(node);
    node.addClass('slideRight');
  },
  switchRoom: function() {
    $('#chats').children().remove();
    data.chats = {};
    server.fetch('https://api.parse.com/1/classes/chatterbox');
  }
};

