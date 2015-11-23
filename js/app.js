$(document).ready(function () {
  // This command is used to initialize some elements and make them work properly
  $.material.init();
    
});

window.addEventListener('DOMContentLoaded', function (event) {
  var database = new Database(); 
  var pageController = new PageController();
  database.initialize();
  pageController.initialize();

  window.dispatchEvent(new CustomEvent('setNavbar', {
    detail: {
      page: 'navbar-home'
    }
  }));

})