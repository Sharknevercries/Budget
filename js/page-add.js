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
        case 'setHint':

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

      $('#main').load('template/page-add.html', $.material.init());      

    }

  }

  exports.PageAdd = PageAdd;

})(window);