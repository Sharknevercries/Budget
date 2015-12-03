(function (exports) {

  var PageItemAdd = function () {

    this._categories = null;

  }

  PageItemAdd.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-item-add') {
            window.dispatchEvent(new CustomEvent('getAllCategories', {
              detail: {
                source: 'page-item-add',
                target: 'database',
              }
            }));
          }
          break;
        case 'getAllCategories':
          if (event.detail.target == 'page-item-add') {
            this.setCategories(event.detail.result);
            this.resetWrapper();
            this.draw();
          }
          break;
      }

    },

    initialize() {

      window.addEventListener('setPage', this);
      window.addEventListener('getAllCategories', this);

    },

    resetWrapper() {

      $('#hint').html('');
      $('#main').html('');

    },

    setCategories(categories) {

      this._categories = categories;

    },

    draw() {

      $('#main').load('template/page-item-add.html', (function () {
        this.setAction();
        $('#main').hide().fadeIn();
      }).bind(this));

    },

    setAction() {

      var list = this._categories;
      var now = new Date();
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      var today = now.getFullYear() + "-" + (month) + "-" + (day);
      list.forEach(function (element) {
        $('#category').append($('<option>', {
          'text': element.description,
          'value': element.id
        }));
      })
      $('#category').val(0);  // Default is Others.
      $('#date').val(today);

      $.material.init();

    }

  }

  exports.PageItemAdd = PageItemAdd;

})(window);