(function (exports) {

  var PageController = function () {

    this._state = null;

  }

  PageController.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setNavbar':
          var nextState = event.detail.page;
          if (this._state != nextState) {
            this._state = nextState;
            if (event.detail.page == 'navbar-home')
              this.drawNavbarHome();
            else if (event.detail.page == 'navbar-edit')
              this.drawNavbarEdit();
            else if (event.detail.page == 'navbar-add')
              this.drawNavbarAdd();
          }
          break;
      }

    },

    initialize() {

      window.addEventListener('setNavbar', this);

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

      $('#page-list').click((function () {
        this.setPage('page-list');
      }).bind(this));
      $('#page-home').click((function () {
        this.setPage('page-home');
      }).bind(this));
      $('#page-add').click((function () {
        this.setNavbar('navbar-add');
        this.setPage('page-add');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-edit section
    //
    //

    drawNavbarEdit() {

      $('#navbar').load('template/navbar-edit.html', this.setNavbarEditAction.bind(this));

    },

    setNavbarEditAction(){

      $('#navbar-home').click((function () {
        this.setNavbar('navbar-home');
        this.setPage('page-list');
      }).bind(this));
      $('#item-delete').click((function () {
        var id = $('#id').val();
        window.dispatchEvent(new CustomEvent('delItem', {
          detail: {
            id: id
          }
        }))
        this.setNavbar('navbar-home');
        this.setPage('page-home');
      }).bind(this));
      $('#item-edit').click((function () {
        var id = $('#id').val();
        var price = $('#price').val();
        var category = $('#category option:selected').val();
        var date = $('#date').val();
        var description = $('#description').val();
        window.dispatchEvent(new CustomEvent('editItem', {
          detail: {
            "id": id,
            "price": price,
            "category": category,
            "date": date,
            "description": description
          }
        }));
        this.setNavbar('navbar-home');
        this.setPage('page-home');
      }).bind(this));

    },

    //
    //
    //  Draw navbar-add section
    //
    //

    drawNavbarAdd() {

      $('#navbar').load('template/navbar-add.html', this.setNavbarAddAction.bind(this));

    },

    setNavbarAddAction() {

      $('#item-cancel').click(this.itemCancel.bind(this));
      $('#item-add').click(this.itemAdd.bind(this));

    },

    itemCancel() {

      this.setNavbar('navbar-home');
      this.setPage('page-home');

    },

    itemAdd() {

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
      this.setNavbar('navbar-home');
      this.setPage('page-home');

    }

  }

  exports.PageController = PageController;

})(window);