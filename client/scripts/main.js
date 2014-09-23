var ChatRoom = function(room) {
  this.chatRoom = (room === undefined || room.length <= 2) ? 'General' : room;
  console.log(this.chatRoom);
  this.$node = $('<li id="' + this.chatRoom + '"><a href="#">' + this.chatRoom + '</a></li>');
  ChatRoom.prototype.addChatRoom.call(this);
}
ChatRoom.prototype.addChatRoom = function(){
  $('.dropdown-menu').append(this.$node[0]);
};
$(document).ready(function() {
  console.log('check');
  app.fetch('https://api.parse.com/1/classes/chatterbox');
  setInterval(function(){
    app.fetch('https://api.parse.com/1/classes/chatterbox');
  }, 10000);
  app.init();
});
