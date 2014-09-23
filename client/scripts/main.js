$(document).ready(function() {
  console.log('check');
  app.fetch('https://api.parse.com/1/classes/chatterbox');
  setInterval(function(){
    app.fetch('https://api.parse.com/1/classes/chatterbox');
  }, 10000);
  app.init();
});
