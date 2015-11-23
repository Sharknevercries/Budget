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
            }));
          }
          break;
        case 'getAllCategories':
          if (event.detail.target == 'page-category-home') {
            this.setCategories(event.detail.categories);
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

      $('#main').html('');

    },

    setCategories(categories) {

      this._categories = categories;

    },

    draw() {

      $('#main').load('template/page-category-home.html', this.drawData.bind(this));

    },

    drawData(){

      var categories = this._categories;
      var self = this;
      
      if (categories == null) {

        $('#category-list').html('<li class="list-group-item"><button class="btn btn-default btn-block btn-material-red">No Category Yet</button></li>');

      }
      else {

        categories.forEach(function (element) {
          var li = $('<li>', { "class": "list-group-item" });
          var btn = $('<button>', {
            id: element.id,
            class: "btn btn-default btn btn-default btn-block btn-material-" + element.color,
            click:  self.btnClickEdit,
            html: element.description
          });
          $(li).append(btn);
          $('#category-list').append(li);
        });

      }

      this.setAction();

    },

    setAction() {

      $.material.init();

    },

    btnClickEdit(event) {

      var btn = event.target;
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