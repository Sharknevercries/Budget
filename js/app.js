$(document).ready(function () {
  // This command is used to initialize some elements and make them work properly
  $.material.init();
    
});

window.addEventListener('DOMContentLoaded', function (event) {
  var database = new Database();
  var navbars = [
    'navbar-category-add', 'navbar-category-edit', 'navbar-category-home',
    'navbar-home', 'navbar-item-add', 'navbar-item-edit'
  ];
  var pages = [
    'page-home', 'page-config',
    'page-item-list', 'page-item-add', 'page-item-edit',
    'page-category-home', 'page-category-add', 'page-category-edit'
  ];
  var pageController = new PageController(navbars, pages);
  database.initialize();
  pageController.initialize();

  window.dispatchEvent(new CustomEvent('setNavbar', {
    detail: {
      page: 'navbar-home'
    }
  }));

})