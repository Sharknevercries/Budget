(function (exports) {

  var PageCategoryHome = function () {

    this._categories = null;

  }

  PageCategoryHome.prototype = {

    handleEvent(event) {
      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-category-home') {
            window.dispatchEvent(new CustomEvent('getAllCategories', {
              detail: {
                source: 'page-category-home',
                target: 'database'
              }
            }))
            this.resetWrapper();
            if ($('#loader').length == 0)
              this.setLoading();
          }
          break;
        case 'getAllCategories':
          if (event.detail.target == 'page-category-home') {
            this.setCategories(event.detail.categories);
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

      $('hint').html('');
      $('#main').html('');

    },

    setCategories(categories) {

      this._categories = categories;

    },

    setLoading() {
      $('#hint').append($('<i>', {
        'id': 'loader',
        'class': 'fa fa-refresh fa-spin fa-2x'
      }));
      $('#loader').css({ position: 'absolute', top: '50%', left: '50%', margin: '-14px 0 0 -14px' });
    },

    draw() {
      
      $('#main').load('template/page-category-home.html', (function () {
        this.drawData();
        $('#loader').remove();
        $('#main').hide().fadeIn();
      }).bind(this));

    },

    drawData(){

      var categories = this._categories;
      var self = this;
      
      console.log(categories);
      categories.forEach(function (element) {
        var li = $('<li>', { 'class': 'list-group-item' });
        var btn = $('<button>', {
          'id': element.id,
          'class': 'btn btn-default btn btn-default btn-block btn-material-' + element.color,
          'click': self.btnClickEdit,
        }).append($('<h4>', { 'text': element.description, 'style': 'text-transform: none' }));
        $(li).append(btn);
        $('#category-list').append(li);
      });      

      this.setAction();

    },

    setAction() {

      $.material.init();

    },

    btnClickEdit(event) {

      var btn = event.target;
      if (btn.id == 0) {
        toastr['error']('Can not edit the default category', 'Error', { timeOut: 3000, positionClass: 'toast-bottom-center', preventDuplicates: true });
        return;
      }
      window.dispatchEvent(new CustomEvent('setNavbar', {
        detail: {
          page: 'navbar-category-edit'
        }
      }));
      window.dispatchEvent(new CustomEvent('setPage', {
        detail: {
          page: 'page-category-edit',
          id: btn.id
        }
      }));
    }

  }

  exports.PageCategoryHome = PageCategoryHome;

})(window);