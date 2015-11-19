(function (exports) {

  var PageEdit = function () {
    this._item = null;
  }

  PageEdit.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-edit') {
            var id = event.detail.id;
            window.dispatchEvent(new CustomEvent('getItemById', {
              detail: {
                source: 'page-edit',
                target: 'item-manager',
                id: id
              }
            }));
          }
          break;
        case 'getItemById':
          if (event.detail.target == 'page-edit') {
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

      $('#main').load('template/page-edit.html', this.setAction.bind(this));

    },

    setAction() {

      var item = this._item;
      $('#id').val(item.id);
      $('#price').val(item.price);
      $('#category select').val(item.category);
      $('#date').val(item.date);
      $('#description').val(item.description);
      $.material.init();

    }

  }

  exports.PageEdit = PageEdit;

})(window);