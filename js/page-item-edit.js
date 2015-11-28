(function (exports) {

  var PageItemEdit = function () {
    this._item = null;
    this._categories = null;
    this._eventCounter = 0;
  }

  PageItemEdit.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-item-edit') {
            var id = event.detail.id;
            this._eventCounter = 0;
            window.dispatchEvent(new CustomEvent('getItemById', {
              detail: {
                source: 'page-item-edit',
                target: 'database',
                id: id
              }
            }));
            window.dispatchEvent(new CustomEvent('getAllCategories', {
              detail: {
                source: 'page-item-edit',
                target: 'database'
              }
            }));
          }
          break;
        case 'getItemById':
          if (event.detail.target == 'page-item-edit') {
            this.setItem(event.detail.item);
            this.dataArrived();
          }
          break;
        case 'getAllCategories':
          if (event.detail.target == 'page-item-edit') {
            this.setCategories(event.detail.categories);
            this.dataArrived();
          }
          break;
      }

    },

    initialize() {

      window.addEventListener('setPage', this);
      window.addEventListener('getAllCategories', this);
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

    dataArrived(){

      this._eventCounter++;
      if (this._eventCounter == 2) {
        this.resetWrapper();
        this.draw();
      }

    },

    draw() {
      
      $('#main').load('template/page-item-edit.html', (function () {
        this.setAction();
        $('#main').hide().fadeIn();
      }).bind(this));

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
        if (item.category == element.id) {
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