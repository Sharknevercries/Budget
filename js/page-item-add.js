(function (exports) {

  var PageItemAdd = function () {

    this._categories = null;

  }

  PageItemAdd.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-item-add') {
            this.resetWrapper();
            this.draw();
          }
          break;
        case 'updateCategories':
          this.setCategories(event.detail.categories);
          break;
      }

    },

    initialize() {

      window.addEventListener('setPage', this);
      window.addEventListener('updateCategories', this);

    },

    resetWrapper() {

      $('#hint').html('');
      $('#main').html('');

    },

    setCategories(categories) {

      this._categories = categories;

    },

    draw() {

      $('#main').load('template/page-item-add.html', this.setAction.bind(this));

    },

    setAction() {

      var list = this._categories;
      var now = new Date();
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      var today = now.getFullYear() + "-" + (month) + "-" + (day);
      list.forEach(function (element) {
        $('#category').append($('<option>', {
          text: element.description,
          value: element.id
        }));
      })
      $('#category').val($('#category option:first').val());
      $('#date').val(today);

      $.material.init();

    }

  }

  exports.PageItemAdd = PageItemAdd;

})(window);