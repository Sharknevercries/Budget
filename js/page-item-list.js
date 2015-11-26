(function (exports) {

  var PageItemList = function(){
    this._items = null;
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
          }
          break;
        case 'getAllItems':
          if (event.detail.target == 'page-item-list') {
            this.setItems(event.detail.items);
            this.resetWrapper();
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

    draw() {
      
      $('#main').load('template/page-item-list.html', this.drawData.bind(this));

    },

    drawData() {

      var items = this._items;
      var self = this;

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

      console.log(dateList);

      idxs.forEach(function (element, idx) {

        var panel = $('<div>', { class: 'panel panel-material-grey' });

        var panelHeading = $('<div>', {
          'class': 'panel-heading',
          'role': 'tab',
        });
        var panelHeadingButton = $('<button>', {
          'type': 'button',
          'class': 'btn btn-default btn-block',
          'click':  self.accordionClick
        })
        // TODO
        // When click, make arrow to right.
        // Category diff color.
        var panelHeadingText1 = $('<div>', { 'class': 'col-xs-6' }).append(
          $('<h3>', { 'class': 'text-left' }).append(
            $('<span>', { 'class': 'glyphicon glyphicon-chevron-down' })
          ).append(document.createTextNode(element))
        );
        var panelHeadingText2 = $('<div>', { 'class': 'col-xs-6' }).append($('<h3>', { 'class': 'text-right', 'text': dateList[element]['sum'] + '$' }));
        panelHeadingButton.append(panelHeadingText1).append(panelHeadingText2);
        panelHeading.append(panelHeadingButton);

        var panelContent = $('<div>', {
          'class': 'panel-collapse hiden',
          'role': 'tabpanel'
        }).on('transitionend', self.changeArrow);

        var ul = $('<ul>', { 'class': 'list-group' });
        dateList[element]['items'].forEach(function (item) {

          var li = $('<li>', { 'class': 'list-group-item' });
          var btn = $('<button>', { 'type': 'button', 'id': item.id, 'class': 'btn btn-default btn-block', 'click': self.itemClick });
          var row1 = $('<div>', { 'class': 'row' }).append(
            $('<div>', { 'class': 'col-xs-8' }).append(
              $('<h4>', { 'class': 'text-left' }).append(
                $('<span>', { 'class': 'label label-material-' + item.color, 'text': item.category })
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
              $('<h5>', { 'class': 'text-left', 'text': item.description })
            )
          )          
          btn.append(row1).append(row2);
          li.append(btn);
          ul.append(li);

        });
        panelContent.append(ul);

        panel.append(panelHeading).append(panelContent);

        $('#accordion').append(panel);

      });

      $.material.init();

    },

    changeArrow(event) {
      var e = event.target;
      var arrow = $(e).parent().find('.panel-heading span');
      if ($(e).hasClass('show'))
        $(arrow).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
      else
        $(arrow).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
    },

    accordionClick(event){
      var e = event.target;
      var sibs = $(e).parent().siblings();
      if ($(sibs).hasClass('show'))
        $(sibs).removeClass('show').addClass('hiden');
      else
        $(sibs).removeClass('hiden').addClass('show');      
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