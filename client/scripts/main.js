var ChatRoom = function(room) {
  this.chatRoom = room;
  data.rooms.push(this.chatRoom);
  this.$node = $('<li id="' + this.chatRoom + '"><a href="#">' + this.chatRoom + '</a></li>');
  ChatRoom.prototype.addChatRoom.call(this);
}
ChatRoom.prototype.addChatRoom = function(){
  $('.dropdown-menu').append(this.$node[0]);
};
$(document).ready(function() {
  // ChatRoom('General');
  var url = 'https://api.parse.com/1/classes/chatterbox';
  server.fetch(url);
  setInterval(function() {
    server.fetch(url);
  }, 2500);
  buttonEvents.init();
});
