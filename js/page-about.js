(function (exports) {

  var PageAbout = function () {
  }

  PageAbout.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-about') {
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

      $('#main').load('template/page-about.html', (function () {
        this.setAction();
        $('#main').hide().fadeIn();
      }).bind(this));

    },

    setAction() {

      $.material.init();

    }

  }

  exports.PageAbout = PageAbout;

})(window);