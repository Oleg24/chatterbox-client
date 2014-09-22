// YOUR CODE HERE:

var app = {
  init: function(){
    $('#main').on('click', '.username', function(event) {
      var username = event.currentTarget.dataset.username;
      app.addFriend(username);
    });
    $('#send .submit').on('submit', function(event){
      // do handlesubmit
      var message = $('#message').val();
      app.handleSubmit(message);
    });
  },
  send: function(message){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data){
        console.log("send works: \n", data);
      },
      error: function(data){
        console.log('send error: \n', data);
      }
    });
  },
  fetch: function(url){
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json', //might not be neccessary
      success: function(data){
        console.log("fetch success: \n", data);
        _.forEach(data.results, function(messageObj){
          // messageObj;
          app.addMessage(messageObj);
        });
      },
      error: function(data){
        console.log("fetch error \n", data);
      }
    });
  },
  clearMessages: function(){
    $('#chats').children().remove();
  },
  addMessage: function(message){
    console.log(message);
    message.username = JSON.stringify(message.username);
    message.text = JSON.stringify(message.text);
    var node = $('<text class="messages username" data-username="' + message.username + '">' + message.username + ": " + message.text + '</text>');
    // based on the message.room we have to select that room in
    // // the dom and append our message to that room
    // chats div
    // $('#' + message.roomname + ' > #chats').append(node);
    $('#chats').append(node);
  },
  addRoom: function(room) {
    var chat_room = $('<div class="chatroom" id="' + room + '"></div>');
    $('#roomSelect').append(chat_room);
  },
  addFriend: function(friend) {

  },
  handleSubmit: function(text){
    console.log('hey');
    var message = {
      username: window.location.search.slice(window.location.search.indexOf('=') + 1),
      text: text
    };
    console.log(window.location.search.slice(window.location.search.indexOf('=') + 1));
    app.addMessage(message);
    app.send(message);
  },
};
