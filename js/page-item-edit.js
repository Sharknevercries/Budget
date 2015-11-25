(function (exports) {

  var PageItemEdit = function () {
    this._item = null;
    this._categories = null;
  }

  PageItemEdit.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-item-edit') {
            var id = event.detail.id;
            window.dispatchEvent(new CustomEvent('getItemById', {
              detail: {
                source: 'page-item-edit',
                target: 'database',
                id: id
              }
            }));
          }
          break;
        case 'getItemById':
          if (event.detail.target == 'page-item-edit') {
            this.setItem(event.detail.item);
            this.resetWrapper();
            this.draw();
          }
          break;
        case 'updateCategories':
          this.setCategories(event.detail.categories);
          break;
      }

    },

    initialize() {

      window.addEventListener('setPage', this);
      window.addEventListener('updateCategories', this);
      window.addEventListener('getItemById', this);

    },

    resetWrapper() {

      $('#hint').html('');
      $('#main').html('');

    },

    setItem(item){
      this._item = item;
    },

    setCategories(categories){
      this._categories = categories;
    },

    draw() {

      $('#main').load('template/page-item-edit.html', this.setAction.bind(this));

    },

    setAction() {

      var item = this._item;
      var list = this._categories;
      var foundCategoryValue = false;
      list.forEach(function (element) {
        $('#category').append($('<option>', {
          text: element.description,
          value: element.id
        }));
        if (item.categories == element.id) {
          foundCategoryValue = true;
          $('#category').val(item.category);
        }
      })
      $('#id').val(item.id);
      $('#price').val(item.price);
      if (!foundCategoryValue)
        $('#category').val(0);  // Others
      $('#date').val(item.date);
      $('#description').val(item.description);
      $.material.init();

    }

  }

  exports.PageItemEdit = PageItemEdit;

})(window);