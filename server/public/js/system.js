(function(){
  'use strict';

  $('.food-search-btn').click(function(){
    var q = $('.food-search').val();
    $.getJSON('/foods/'+q, function(results){
      $('.search-results').empty();
      if(results.length > 0){
        for (var i = 0; i < results.length;i++) {
          var result = results[i];
          $('.search-results').append(renderFoodContainer({food: JSON.stringify(result), foodName: result.name.en}));
        }
      } else {
        $('.search-results').append('<p>No results</p>');
      }
    });
  });

  $('.add-device-btn').click(function(){
    bootbox.dialog({
      message: renderAddDeviceModal(),
      buttons: {
        'Add device': function() {
          var deviceName = $('#deviceNameInput').val();
          var deviceId = $('#deviceIdInput').val();
          $.post('/device', { deviceId: deviceId, deviceName: deviceName }, function(result) {
            bootbox.alert('Device added', function(){
              location.reload();
            });
          });
        }
      }
    });
  });

  $(document).on('dragstart', '.food-container', function(event) {
    event.originalEvent.dataTransfer.setData('text', $(this).attr('data-food'));
  });

  $('.device-container').on('dragover', function(event){
    event.preventDefault();
  });

  $('.device-container').on('drop', function(event){
    event.preventDefault();
    var data = JSON.parse(event.originalEvent.dataTransfer.getData('text'));
    var id = $(this).attr('data-device-id');
    $.post('/device/'+id, data, function(res){
      location.reload();
    });
  });

})();