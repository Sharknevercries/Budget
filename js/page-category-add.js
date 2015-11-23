(function (exports) {

  var PageCategoryAdd = function () {
  }

  PageCategoryAdd.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-category-add') {
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

      $('#main').load('template/page-category-add.html', this.setAction.bind(this));

    },

    setAction() {
     
      $.material.init();

    }

  }

  exports.PageCategoryAdd = PageCategoryAdd;

})(window);