(function (exports) {

  var PageItemAdd = function () {
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

      $('#main').load('template/page-item-add.html', this.setAction.bind(this));

    },

    setAction() {

      $.material.init();

    }

  }

  exports.PageItemAdd = PageItemAdd;

})(window);