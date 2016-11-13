(function(){
  'use strict';

  var socket = io('http://localhost:3000');

  $('.user-arrived').click(function(){
    var tag = $('.user-tag').val();
    var device = $('.device-id').val();
    socket.emit('tag-found', {tag: tag, device: device});
  });

  $('.food-changed').click(function(){
    var tag = $('.user-tag').val();
    var device = $('.device-id').val();
    var amount = $('.food-amount').val();
    socket.emit('food-changed', { amount: amount, tag: tag, device: device});
  });

  $('.user-left').click(function(){
    var tag = $('.user-tag').val();
    var device = $('.device-id').val();
    var amount = $('.food-amount').val();
    socket.emit('food-taken', { amount: amount, tag: tag, device: device});
  });

})();