(function (exports) {

  var PageCategoryEdit = function () {
    this._category = null;
  }

  PageCategoryEdit.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-category-edit') {
            var id = event.detail.id;
            window.dispatchEvent(new CustomEvent('getCategoryById', {
              detail: {
                source: 'page-category-edit',
                target: 'database',
                id: id
              }
            }));
          }
          break;
        case 'getCategoryById':
          if (event.detail.target == 'page-category-edit') {
            this.resetWrapper();
            this.setCategory(event.detail.category);
            this.draw();
          }
          break;
      }

    },

    initialize() {

      window.addEventListener('setPage', this);
      window.addEventListener('getCategoryById', this);

    },

    resetWrapper() {

      $('#hint').html('');
      $('#main').html('');

    },

    setCategory(category) {
      this._category = category;
    },

    draw() {

      $('#main').load('template/page-category-edit.html', this.setAction.bind(this));

    },

    setAction() {

      var category = this._category;
      console.log(category);
      var id = category.id;
      var color = category.color;
      var description = category.description;
      $('#id').val(id);
      $('#color').val(color);
      $('#description').val(description);
      $.material.init();

    }

  }

  exports.PageCategoryEdit = PageCategoryEdit;

})(window);