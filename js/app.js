$(document).ready(function () {
  // This command is used to initialize some elements and make them work properly
  $.material.init();
    
});

window.addEventListener('DOMContentLoaded', function (event) {
  $('#page-list').click(function () {    
    window.dispatchEvent(new CustomEvent('focusOn', {
      detail: {
        page: 'page-list'
      }
    }));
  });
  $('#page-home').click(function () {
    window.dispatchEvent(new CustomEvent('focusOn', {
      detail: {
        page: 'page-home'
      }
    }));
  });
  $('#page-add').click(function () {
    $('#hint').html('');
    $('#main').load('page-add.html');
    $(document).on('click', '#add-record', function () {
      var price = $('#price').val();
      var category = $('#category option:selected').val();
      var date = $('#date').val();
      var description = $('#description').val();
      window.dispatchEvent(new CustomEvent('addItem', {
        detail: {
          "price": price,
          "category": category,
          "date": date,
          "description": description
        }
      }));
    })
  });

  var itemManager = new ItemManager();
  var pageList = new PageList();
  var pageHome = new PageHome();
  itemManager.initialize();
  pageList.initialize();
  pageHome.initialize();

  $('#page-home').click();
})