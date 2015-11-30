(function (exports) {

  // TODO
  // 1. Make pages to follow standard flow like below:
  // called by page-controller -> requestData -> draw template -> draw data -> put actions.
  //
  // 2. Make navbars to split into many files.

  var PageController = function (navbarNames, pagesNames) {

    this._navbarNames = navbarNames;
    this._pageNames = pagesNames;
    this._navbars = {};
    this._pages = {};

  }

  PageController.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setNavbar':
          this._navbars[event.detail.page]();
          break;
      }

    },

    initialize() {

      window.addEventListener('setNavbar', this);
      var navbarNames = this._navbarNames;
      var pageNames = this._pageNames;
      navbarNames.forEach(function (navbarName) {
        this._navbars[navbarName] = this.addNavbar(navbarName);
      }, this);
      pageNames.forEach(function (pageName) {
        this._pages[pageName] = this.addPage(pageName);
        this._pages[pageName].initialize();
      }, this);

    },

    addNavbar(navbarName) {
      switch (navbarName) {
        case 'navbar-home':
          return this.drawNavbarHome.bind(this);
        case 'navbar-item-add':
          return this.drawNavbarItemAdd.bind(this);
        case 'navbar-item-edit':
          return this.drawNavbarItemEdit.bind(this);
        case 'navbar-category-home':
          return this.drawNavbarCategoryHome.bind(this);
        case 'navbar-category-add':
          return this.drawNavbarCategoryAdd.bind(this);
        case 'navbar-category-edit':
          return this.drawNavbarCategoryEdit.bind(this);
        case 'navbar-about':
          return this.drawNavbarAbout.bind(this);
      }
    },

    addPage(pageName){
      switch (pageName) {
        case 'page-home':
          return new PageHome();
        case 'page-config':
          return new PageConfig();
        case 'page-item-list':
          return new PageItemList();
        case 'page-item-add':
          return new PageItemAdd();
        case 'page-item-edit':
          return new PageItemEdit();
        case 'page-category-home':
          return new PageCategoryHome();
        case 'page-category-add':
          return new PageCategoryAdd();
        case 'page-category-edit':
          return new PageCategoryEdit();
        case 'page-about':
          return new PageAbout();
      }
    },

    setNavbar(page) {

      window.dispatchEvent(new CustomEvent('setNavbar', {
        detail: {
          page: page
        }
      }));

    },

    setPage(page) {

      window.dispatchEvent(new CustomEvent('setPage', {
        detail: {
          page: page
        }
      }));

    },

    showHint(type, title, msg) {

      toastr[type](msg, title, { timeOut: 3000, positionClass: 'toast-bottom-center', preventDuplicates: true });

    },

    //
    //
    //  Draw navbar-home section
    //
    //

    drawNavbar(href, callback){

      $('#navbar').load(href, (function () {
        callback();
        $('#navbar').hide().fadeIn();
      }).bind(this));

    },

    drawNavbarHome() {

      this.drawNavbar('template/navbar-home.html', this.setNavbarHomeAction.bind(this));

    },

    setNavbarHomeAction() {

      $('#page-item-list').click((function () {
        this.setPage('page-item-list');
      }).bind(this));
      $('#page-home').click((function () {
        this.setPage('page-home');
      }).bind(this));
      $('#page-config').click((function () {
        this.setPage('page-config');
      }).bind(this));
      $('#page-item-add').click((function () {
        this.setNavbar('navbar-item-add');
        this.setPage('page-item-add');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-item-edit section
    //
    //

    drawNavbarItemEdit() {

      this.drawNavbar('template/navbar-item-edit.html', this.setNavbarItemEditAction.bind(this));

    },

    setNavbarItemEditAction(){

      $('#go-back').click((function () {
        this.setNavbar('navbar-home');
        this.setPage('page-item-list');
      }).bind(this));
      $('#delete').click((function () {
        var id = $('#id').val();
        window.dispatchEvent(new CustomEvent('delItem', {
          detail: {
            id: id
          }
        }))
        this.setNavbar('navbar-home');
        this.setPage('page-item-list');
      }).bind(this));
      $('#edit').click((function () {
        var id = $('#id').val();
        var price = $('#price').val();
        var category = $('#category option:selected').val();
        var date = $('#date').val();
        var description = $('#description').val();
        if (!($.isNumeric(price) && price == Math.floor(price) && price >= 0)) {
          this.showHint('error', 'Invalid Input', 'Price must be positive integer or zero');
          return;
        }
        window.dispatchEvent(new CustomEvent('editItem', {
          detail: {
            id: id,
            price: price,
            category: category,
            date: date,
            description: description
          }
        }));
        this.setNavbar('navbar-home');
        this.setPage('page-home');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-item-add section
    //
    //

    drawNavbarItemAdd() {

      this.drawNavbar('template/navbar-item-add.html', this.setNavbarItemAddAction.bind(this));

    },

    setNavbarItemAddAction() {

      $('#cancel').click((function () {
        this.setNavbar('navbar-home');
        this.setPage('page-home');
      }).bind(this));
      $('#add').click((function () {
        var price = $('#price').val();
        var category = $('#category option:selected').val();
        var date = $('#date').val();
        var description = $('#description').val();
        if (!($.isNumeric(price) && price == Math.floor(price) && price >= 0)) {
          this.showHint('error', 'Invalid Input', 'Price must be positive integer or zero');
          return;
        }
        window.dispatchEvent(new CustomEvent('addItem', {
          detail: {
            price: price,
            category: category,
            date: date,
            description: description
          }
        }));
        this.setNavbar('navbar-home');
        this.setPage('page-home');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-category-home section
    //
    //

    drawNavbarCategoryHome() {

      this.drawNavbar('template/navbar-category-home.html', this.setNavbarCategoryHomeAction.bind(this));

    },

    setNavbarCategoryHomeAction() {

      $('#go-back').click((function () {
        this.setPage('page-config');
        this.setNavbar('navbar-home');
      }).bind(this));
      $('#add').click((function () {
        this.setPage('page-category-add');
        this.setNavbar('navbar-category-add');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-category-add section
    //
    //

    drawNavbarCategoryAdd(){

      this.drawNavbar('template/navbar-category-add.html', this.setNavbarCategoryAddAction.bind(this));

    },

    setNavbarCategoryAddAction() {

      $('#cancel').click((function () {
        this.setPage('page-category-home');
        this.setNavbar('navbar-category-home');
      }).bind(this));
      $('#add').click((function () {
        var description = $('#description').val();
        var color = $('#color option:selected').val();
        if (description == '') {
          this.showHint('error', 'Invalid Input', 'Description must not be empty');
          return;
        }
        window.dispatchEvent(new CustomEvent('addCategory', {
          detail: {
            description: description,
            color: color
          }
        }));
        this.setPage('page-category-home');
        this.setNavbar('navbar-category-home');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-category-edit section
    //
    //

    drawNavbarCategoryEdit(){

      this.drawNavbar('template/navbar-category-edit.html', this.setNavbarCategoryEditAction.bind(this));

    },

    setNavbarCategoryEditAction() {

      $('#navbar-category-home').click((function () {
        this.setNavbar('navbar-category-home');
        this.setPage('page-category-home');
      }).bind(this));
      $('#delete').click((function () {
        var id = $('#id').val();
        window.dispatchEvent(new CustomEvent('delCategory', {
          detail: {
            id: id
          }
        }))
        this.setNavbar('navbar-category-home');
        this.setPage('page-category-home');
      }).bind(this));
      $('#edit').click((function () {
        var id = $('#id').val();
        var color = $('#color option:selected').val();
        var description = $('#description').val();
        if (description == '') {
          this.showHint('error', 'Invalid Input', 'Description must not be empty');
          return;
        }
        window.dispatchEvent(new CustomEvent('editCategory', {
          detail: {
            id: id,
            color: color,
            description: description
          }
        }));
        this.setNavbar('navbar-category-home');
        this.setPage('page-category-home');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-about section
    //
    //

    drawNavbarAbout(){

      this.drawNavbar('template/navbar-about.html', this.setNavbarAboutAction.bind(this));

    },

    setNavbarAboutAction() {

      $('#go-back').click((function () {
        this.setPage('page-config');
        this.setNavbar('navbar-home');
      }).bind(this));

    }

  }

  exports.PageController = PageController;

})(window);