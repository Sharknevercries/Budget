(function (exports) {

  var PageItemEdit = function () {
    this._item = null;
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
            this.resetWrapper();
            this.setItem(event.detail.item);
            this.draw();
          }
          break;
      }

    },

    initialize() {

      window.addEventListener('setPage', this);
      window.addEventListener('getItemById', this);

    },

    resetWrapper() {

      $('#hint').html('');
      $('#main').html('');

    },

    setItem(item){
      this._item = item;
    },

    draw() {

      $('#main').load('template/page-item-edit.html', this.setAction.bind(this));

    },

    setAction() {

      var item = this._item;
      $('#id').val(item.id);
      $('#price').val(item.price);
      $('#category').val(item.category);
      $('#date').val(item.date);
      $('#description').val(item.description);
      $.material.init();

    }

  }

  exports.PageItemEdit = PageItemEdit;

})(window);