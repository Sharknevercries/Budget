(function (exports) {

  var PageHome = function () {
    this._items = null;
    this._monthParser = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  }

  PageHome.prototype = {

    handleEvent(event) {
      switch (event.type) {
        case 'setPage':
          if (event.detail.page == 'page-home') {
            var date = new Date();
            var year_month = date.getFullYear() + '-' + (date.getMonth() + 1);
            window.dispatchEvent(new CustomEvent('getItemsByYearMonth', {
              detail:
              {
                year_month: year_month,
                source: 'page-home',
                target: 'database'
              }
            }));
          }
          break;
        case 'getItemsByYearMonth':
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

      window.addEventListener('setPage', this);
      window.addEventListener('getItemsByYearMonth', this);

    },

    setItems(items){
      this._items = items;
    },

    resetWrapper() {

      $('#main').html('');

    },

    draw() {

      $('#hint').append($('<i>', {
        'id': 'loader',
        'class': 'fa fa-refresh fa-spin fa-2x'
      }));
      $('#loader').css({ position: 'absolute', top: '50%', left: '50%', margin: '-14px 0 0 -14px' });
      $('#main').load('template/page-home.html', (function () {
        this.drawData();
        $('#loader').remove();
        $('#main').hide().fadeIn(1000);
      }).bind(this));

    },

    drawData() {

      var items = this._items;
      var totalSum = 0;
      var categoryInfo = {};
      var maxCategorySum = 0;

      items.forEach(function (element) {
        var idx = element.category;
        if (!categoryInfo[idx]) {
          categoryInfo[idx] = {};
          categoryInfo[idx]['sum'] = 0;
          categoryInfo[idx]['color'] = element.color;
        }
        categoryInfo[idx]['sum'] += element.price;
        totalSum += element.price;
      });      

      $('#title').append(
        $('<h3>', { 'class': 'text-center', 'text': this._monthParser[(new Date()).getMonth()] })
      ).append(
        $('<h3>', { 'class': 'text-center', 'text': totalSum + '$' })
      );

      if (Object.keys(categoryInfo).length > 0) {

        Object.keys(categoryInfo).forEach(function (element) {
          if (maxCategorySum < categoryInfo[element]['sum'])
            maxCategorySum = categoryInfo[element]['sum'];
        });

        Object.keys(categoryInfo).forEach(function (element) {
          $('#chart').append(
            $('<div>').append(
              $('<h3>').append(
                $('<span>', { 'class': 'label label-material-' + categoryInfo[element]['color'], 'text': element, 'style': 'text-transform: none' })
              ).append(
                $('<small>', { 'text': categoryInfo[element]['sum'] + '$' })
              )
            ).append(
                $('<div>', { 'class': 'progress' }).append(
                  $('<div>', {
                    'class': 'progress-bar progress-bar-material-' + categoryInfo[element]['color'],
                    'role': 'progressbar',
                    'aria-valuemin': '0',
                    'aria-valuemax': '100',
                    'style': 'width: ' + categoryInfo[element]['sum'] / maxCategorySum * 100 + '%'
                  })
                )
              )
          )
        });

      }
      else {

        $('#chart').append(
          $('<div>').append(
            $('<h3>', { 'class': 'text-center', 'text': 'Nothing Added This Month' })
          )
        );
      }

      $.material.init();

    }

  }

  exports.PageHome = PageHome;

})(window);