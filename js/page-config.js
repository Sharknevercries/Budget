(function (exports) {

  var PageConfig = function () {

  }

  PageConfig.prototype = {

    handleEvent(event) {
      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-config') {
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

    setCategories(categories){
      this._categories = categories;
    },

    draw() {

      $('#main').load('template/page-config.html', this.setAction.bind(this));

    },

    setAction() {

      $('#category-config').click((function () {
        window.dispatchEvent(new CustomEvent('setNavbar', {
          detail: {
            page: 'navbar-category-home'
          }
        }));
        window.dispatchEvent(new CustomEvent('setPage', {
          detail: {
            page: 'page-category-home'
          }
        }));
      }).bind(this));
      $.material.init();

    }

  }

  exports.PageConfig = PageConfig;

})(window);