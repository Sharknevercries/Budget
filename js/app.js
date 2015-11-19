$(document).ready(function () {
  // This command is used to initialize some elements and make them work properly
  $.material.init();
    
});

window.addEventListener('DOMContentLoaded', function (event) {
  var itemManager = new ItemManager();
  var pageList = new PageList();
  var pageHome = new PageHome();
  var pageAdd = new PageAdd();
  var pageEdit = new PageEdit();
  var pageController = new PageController();
  itemManager.initialize();
  pageList.initialize();
  pageHome.initialize();
  pageAdd.initialize();
  pageEdit.initialize();
  pageController.initialize();

  window.dispatchEvent(new CustomEvent('setNavbar', {
    detail: {
      page: 'navbar-home'
    }
  }));

})