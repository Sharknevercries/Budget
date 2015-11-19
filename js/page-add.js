(function (exports) {

  var PageAdd = function () {

  }

  PageAdd.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-add') {
            this.resetWrapper();
            this.draw();
          }
          break;
      }

    },

    initialize() {

      window.addEventListener('setPage', this);

    },

    resetWrapper() {

      $('#hint').html('');
      $('#main').html('');

    },

    draw() {

      $('#main').load('template/page-add.html', this.setAction.bind(this));

    },

    setAction() {

      $('#price').change(function () {
        var price = this.value;
        if (!($.isNumeric(price) && price == Math.floor(price) && price >= 0)) {
          this.value = 0;
        }
      })
      $.material.init();

    }

  }

  exports.PageAdd = PageAdd;

})(window);