(function (exports) {

  var PageController = function () {

    this._pages = [];

  }

  PageController.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setNavbar':
          if (event.detail.page == 'navbar-home')
            this.drawNavbarHome();
          else if (event.detail.page == 'navbar-item-add')
            this.drawNavbarItemAdd();
          else if (event.detail.page == 'navbar-item-edit')
            this.drawNavbarItemEdit();
          else if (event.detail.page == 'navbar-category-home')
            this.drawNavbarCategoryHome();
          else if (event.detail.page == 'navbar-category-add')
            this.drawNavbarCategoryAdd();
          else if (event.detail.page == 'navbar-category-edit')
            this.drawNavbarCategoryEdit();
          break;
      }

    },

    initialize() {

      window.addEventListener('setNavbar', this);
      this._pages.push(new PageHome());
      this._pages.push(new PageConfig());
      this._pages.push(new PageItemAdd());
      this._pages.push(new PageItemEdit());
      this._pages.push(new PageItemList());
      this._pages.push(new PageCategoryHome());
      this._pages.push(new PageCategoryAdd());
      this._pages.push(new PageCategoryEdit());
      this._pages.forEach(function (element) {
        element.initialize();
      });

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

    //
    //
    //  Draw navbar-home section
    //
    //

    drawNavbarHome() {

      $('#navbar').load('template/navbar-home.html', this.setNavbarHomeAction.bind(this));

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

      $('#navbar').load('template/navbar-item-edit.html', this.setNavbarItemEditAction.bind(this));

    },

    setNavbarItemEditAction(){

      $('#navbar-home').click((function () {
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
        this.setPage('page-home');
      }).bind(this));
      $('#edit').click((function () {
        var id = $('#id').val();
        var price = $('#price').val();
        var category = $('#category option:selected').val();
        var date = $('#date').val();
        var description = $('#description').val();
        if (!($.isNumeric(price) && price == Math.floor(price) && price >= 0)) {
          alert("Price must be positive integer or zero.");
        }
        else {
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
        }
      }).bind(this));

    },

    //
    //
    //  Draw navbar-item-add section
    //
    //

    drawNavbarItemAdd() {

      $('#navbar').load('template/navbar-item-add.html', this.setNavbarItemAddAction.bind(this));

    },

    setNavbarItemAddAction() {

      $('#cancel').click((function () {
        this.setNavbar('navbar-home');
        this.setPage('page-home');
      }).bind(this));
      $('#add').click((function(){
        var price = $('#price').val();
        var category = $('#category option:selected').val();
        var date = $('#date').val();
        var description = $('#description').val();
        if (!($.isNumeric(price) && price == Math.floor(price) && price >= 0)) {
          alert("Price must be positive integer or zero.");
        }
        else {
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
        }
      }).bind(this));

    },

    //
    //
    //  Draw navbar-category-home section
    //
    //

    drawNavbarCategoryHome() {

      $('#navbar').load('template/navbar-category-home.html', this.setNavbarCategoryHomeAction.bind(this));

    },

    setNavbarCategoryHomeAction() {

      $('#navbar-home').click((function () {
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

      $('#navbar').load('template/navbar-category-add.html', this.setNavbarCategoryAddAction.bind(this));

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
          alert("Description must not be empty!");
        }
        else {
          window.dispatchEvent(new CustomEvent('addCategory', {
            detail: {
              description: description,
              color: color
            }
          }));
          this.setPage('page-category-home');
          this.setNavbar('navbar-category-home');
        }
      }).bind(this));

    },

    //
    //
    //  Draw navbar-category-edit section
    //
    //

    drawNavbarCategoryEdit(){

      $('#navbar').load('template/navbar-category-edit.html', this.setNavbarCategoryEditAction.bind(this));

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
          alert("Description must not be empty!");
        }
        else {
          window.dispatchEvent(new CustomEvent('editCategory', {
            detail: {
              id: id,
              color: color,
              description: description
            }
          }));
          this.setNavbar('navbar-category-home');
          this.setPage('page-category-home');
        }
      }).bind(this));

    }

  }

  exports.PageController = PageController;

})(window);