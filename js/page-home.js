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

      $('#main').load('template/page-home.html', this.drawData.bind(this));

    },

    drawData() {
      
      var items = this._items;
      var totalSum = 0;
      var categorySum = {};
      var maxCategorySum = 0;

      items.forEach(function (element) {
        var idx = element.category;
        if (!categorySum[idx]) {
          categorySum[idx] = 0;
        }
        categorySum[idx] += element.price;
      });

      Object.keys(categorySum).forEach(function (element) {
        totalSum += categorySum[element];
        if(maxCategorySum < categorySum[element])
          maxCategorySum = categorySum[element];
      });

      var title = document.querySelector('#title');
      var h5 = document.createElement('h5');
      h5.classList.add('text-center');
      h5.textContent = this._monthParser[(new Date()).getMonth()];
      var h3 = document.createElement('h3');
      h3.classList.add('text-center');
      h3.textContent = totalSum + '$';
      title.appendChild(h5);
      title.appendChild(h3);

      var chart = document.querySelector('#chart');
      Object.keys(categorySum).forEach(function(element){
        var h6 = document.createElement('h6');
        h6.textContent = element + " " + categorySum[element] + '$';
        var outerDiv = document.createElement('div');
        outerDiv.classList.add('progress');
        var innerDiv = document.createElement('div');
        innerDiv.classList.add('progress-bar');
        innerDiv.setAttribute('role', 'progressbar');
        innerDiv.setAttribute('aria-valuemin', '0');
        innerDiv.setAttribute('aria-valuemax', '100');
        innerDiv.style = "width: " + categorySum[element] / maxCategorySum * 100 + "%;";
        outerDiv.appendChild(innerDiv);
        h6.appendChild(outerDiv);
        chart.appendChild(h6);
      });

      $.material.init();

    }

  }

  exports.PageHome = PageHome;

})(window);