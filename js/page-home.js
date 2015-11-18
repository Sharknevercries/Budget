(function (exports) {

  var PageHome = function () {
    this._items = null;
  }

  PageHome.prototype = {

    handleEvent(event) {
      switch (event.type) {
        case 'focusOn':
          if (event.detail.target == 'page-home') {
            var date = new Date();
            var year_month = date.getFullYear() + '-' + date.getMonth();
            window.dispatchEvent('getItemByYearMonth', {
              detail:
              {
                year_month: year_month,
                source: 'page-home',
                target: 'item-manager'
              }
            });
          }
          break;
        case 'getItemByYearMonth':
          if (event.detail.target == 'page-home') {
            var items = event.detail.items;
            this.setItems(items);
            this.resetWrapper();
            this.draw();
          }
          break;
      }
    },

    initialize() {
      window.addEventListener('focusOn', this);
      window.addEventListener('getItem', this);
    },

    setItems(items){
      this._items = items;
    },

    resetWrapper() {
      $('#hint').html('');
      $('#main').html('');
    },

    draw() {
      var items = this._items;

      items.sort(function (a, b) {
        if (a.date < b.date || a.date == b.date && a.id < b.id)
          return 1;
        if (a.date > b.date || a.date == b.date && a.id > b.id)
          return -1;
        return 0;
      });

      var idxs = [];
      var dateList = {};

      items.forEach(function (element) {
        var idx = element.date.substr(0, 7);
        if (!dateList[idx]) {
          dateList[idx] = {};
          dateList[idx]['sum'] = 0;
          dateList[idx]['items'] = [];
          idxs.push(idx);
        }
        dateList[idx]['items'].push(element);
        dateList[idx]['sum'] += parseInt(element.price);
      });
    }

  }

  exports.PageHome = PageHome;

})(window);