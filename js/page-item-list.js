(function (exports) {

  var PageItemList = function(){
    this._items = null;
    this._dateList = null;
    this._eventCounter = 0;
  }

  PageItemList.prototype = {

    handleEvent(event) {
      switch (event.type) {
        case 'setPage':
          if (event.detail.page == "page-item-list") {
            window.dispatchEvent(new CustomEvent('getAllItems', {
              detail:
              {
                source: 'page-item-list',
                target: 'database'
              }
            }));
            this.resetWrapper();
            if ($('#loader').length == 0)
              this.setLoading();
          }
          break;
        case 'getAllItems':
          if (event.detail.target == 'page-item-list') {
            this.setItems(event.detail.result);
            this.draw();
          }
          break;
      }
    },

    initialize(){
      window.addEventListener('setPage', this);
      window.addEventListener('getAllItems', this);
    },

    setItems(items) {
      this._items = items;
    },

    resetWrapper() {

      $('#hint').html('');
      $('#main').html('');

    },

    setLoading() {
      $('#hint').append($('<i>', {
        'id': 'loader',
        'class': 'fa fa-refresh fa-spin fa-2x'
      }));
      $('#loader').css({ position: 'absolute', top: '50%', left: '50%', margin: '-14px 0 0 -14px' });
    },

    draw() {
      
      $('#main').load('template/page-item-list.html', (function () {
        this.drawData();
        $('#loader').remove();
        $('#main').hide().fadeIn(1000);
      }).bind(this));

    },

    calculateYearMonthSum(items){

      var dateList = {};

      items.forEach(function (element) {
        var idx = element.date.substr(0, 7);
        if (!dateList[idx]) {
          dateList[idx] = {};
          dateList[idx]['sum'] = 0;
          dateList[idx]['items'] = [];
        }
        dateList[idx]['items'].push(element);
        dateList[idx]['sum'] += parseInt(element.price);
      });

      return dateList;

    },

    drawData() {

      var items = this._items;

      if (items.length > 0) {

        this._dateList = this.calculateYearMonthSum(items);
        var self = this;
        var dateList = this._dateList;

        Object.keys(dateList).forEach(function (element, idx) {

          var panel = $('<div>', { class: 'panel panel-material-grey' });

          var panelHeading = $('<div>', {
            'id': element,
            'class': 'panel-heading',
            'role': 'tab'
          });
          var panelHeadingButton = $('<button>', {
            'type': 'button',
            'class': 'btn btn-default btn-block',
            'click': self.accordionClick.bind(self)
          })
          var panelHeadingText1 = $('<div>', { 'class': 'col-xs-2' }).append(
            $('<h4>', { 'class': 'text-left' }).append(
              $('<i>', { 'class': 'fa fa-chevron-down' })
            )
          );
          var panelHeadingText2 = $('<div>', { 'class': 'col-xs-4' }).append(
            $('<h4>', { 'class': 'text-left' }).append(document.createTextNode(element))
          );
          var panelHeadingText3 = $('<div>', { 'class': 'col-xs-6' }).append($('<h4>', { 'class': 'text-right', 'text': dateList[element]['sum'] + '$' }));
          panelHeadingButton.append(panelHeadingText1).append(panelHeadingText2).append(panelHeadingText3);
          panelHeading.append(panelHeadingButton);

          var panelContent = $('<div>', {
            'class': 'panel-collapse hiden',
            'role': 'tabpanel'
          }).on('transitionend', self.changeArrow);

          var ul = $('<ul>', { 'class': 'list-group' });
          dateList[element]['items'].forEach(function (item, idx) {

            var li = $('<li>', { 'class': 'list-group-item' });
            var btn = $('<button>', { 'type': 'button', 'id': item.id, 'class': 'btn btn-default btn-block', 'click': self.itemClick });
            var row1 = $('<div>', { 'class': 'row' }).append(
              $('<div>', { 'class': 'col-xs-8' }).append(
                $('<h4>', { 'class': 'text-left' }).append(
                  $('<span>', { 'class': 'label label-material-' + item.color, 'text': item.category, 'style': 'text-transform: none' })
                ).append(
                  $('<small>', { 'text': ' ' + item.date })
                )
              )
            ).append(
              $('<div>', { 'class': 'col-xs-4' }).append(
                $('<h4>', { 'class': 'text-right', 'text': item.price + '$' })
              )
            )
            var row2 = $('<div>', { 'class': 'row' }).append(
              $('<div>', { 'class': 'col-xs-12' }).append(
                $('<p>', { 'class': 'text-left', 'text': item.description, 'style': 'text-transform: none' })
              )
            )
            btn.append(row1).append(row2);
            li.append(btn);
            if (idx > 0) {
              ul.append($('<hr>', { 'class': 'sub' }));
            }
            ul.append(li);

          });
          panelContent.append(ul);

          panel.append(panelHeading).append(panelContent);

          $('#accordion').append(panel);

        });

      }
      else {

        $('#accordion').append(
         $('<div>').append(
           $('<h3>', { 'class': 'text-center', 'text': 'Nothing Added' })
         )
        );

      }

      $.material.init();

    },

    changeArrow(event) {
      var e = event.target;
      var arrow = $(e).parent().find('.panel-heading i');
      if ($(e).hasClass('show'))
        $(arrow).removeClass('fa-chevron-down').addClass('fa-chevron-right');
      else
        $(arrow).removeClass('fa-chevron-right').addClass('fa-chevron-down');
    },

    accordionClick(event) {
      var dateList = this._dateList;
      var e = event.target;
      var heading = $(e).parent();
      var id = $(heading).attr('id');
      var count = dateList[id]['items'].length;
      var sibs = $(heading).siblings();
      if ($(sibs).hasClass('show'))
        $(sibs).removeClass('show').addClass('hiden').css({ 'max-height': '0px' });
      else
        $(sibs).removeClass('hiden').addClass('show').css({ 'max-height': count * 85 + 'px' });      
    },

    itemClick(event) {

      var btn = event.target;
      window.dispatchEvent(new CustomEvent('setNavbar', {
        detail: {
          page: 'navbar-item-edit'
        }
      }));
      window.dispatchEvent(new CustomEvent('setPage', {
        detail: {
          page: 'page-item-edit',
          id: btn.id
        }
      }));

    }

  }

  exports.PageItemList = PageItemList;

})(window);