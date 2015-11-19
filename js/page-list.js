(function (exports) {

  var PageList = function(){
    this._items = null;
  }

  PageList.prototype = {

    handleEvent(event) {
      switch (event.type) {
        case 'setPage':
          if (event.detail.page == "page-list") {
            window.dispatchEvent(new CustomEvent('getAllItems', {
              detail:
              {
                source: 'page-list',
                target: 'item-manager'
              }
            }));
          }
          break;
        case 'getAllItems':
          if (event.detail.target == 'page-list') {
            var items = event.detail.items;
            this.setItems(items);
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
      
      var self = this;
      var accordion = document.createElement('div');
      accordion.id = 'accordion';
      accordion.setAttribute('role', 'tablist');
      accordion.setAttribute('aria-multiselectable', true);
      
      var items = this._items;

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

      idxs.forEach(function (element, idx) {
        var panel = document.createElement('div');
        panel.classList.add('panel', 'panel-material-grey-500');

        var panelHeading = document.createElement('div');
        panelHeading.id = 'heading' + idx;
        panelHeading.classList.add('panel-heading', 'col-xs-12');
        panelHeading.setAttribute('role', 'tab');
        panelHeading.setAttribute('data-toggle', 'collapse');
        panelHeading.setAttribute('date-parent', '#accordion');
        panelHeading.setAttribute('href', '#collapse' + idx);
        panelHeading.setAttribute('aria-expanded', true);
        panelHeading.setAttribute('aria-controls', 'collapse' + idx);
        var h3 = document.createElement('h3');
        h3.classList.add('text-left');
        var spanicon = document.createElement('span');
        spanicon.classList.add('glyphicon', 'glyphicon-chevron-right');
        var sumPrice = document.createElement('span');
        sumPrice.classList.add('pull-right');
        sumPrice.appendChild(document.createTextNode(dateList[element]['sum'] + '$'));
        h3.appendChild(spanicon);
        h3.appendChild(document.createTextNode(element));
        h3.appendChild(sumPrice);
        panelHeading.appendChild(h3);
        
        var panelContent = document.createElement('div');
        panelContent.id = 'collapse' + idx;
        panelContent.classList.add('panel-collapse', 'collapse', 'in');
        panelContent.setAttribute('aria-labelledby', 'heading' + idx);
        var table = document.createElement('table');
        table.classList.add('table');
        
        dateList[element]['items'].forEach(function (item) {
          var tr1 = document.createElement('tr');
          var tr2 = document.createElement('tr');
          var td1 = document.createElement('td');
          td1.rowSpan = 2;
          td1.classList.add('col-xs-1', 'text-center');
          td1.style = 'vertical-align: middle';
          td1.textContent = item['date'];
          var td2 = document.createElement('td');
          td2.classList.add('col-xs-6');
          td2.textContent = item['category'];
          var td3 = document.createElement('td');
          td3.rowSpan = 2;
          td3.classList.add('col-xs-5', 'text-center');
          td3.style = 'vertical-align: middle';
          var editButton = document.createElement('button');
          editButton.classList.add('btn', 'btn-default', 'btn-raised', 'btn-xs');
          editButton.textContent = item['price'] + '$';
          editButton.id = item['id'];
          editButton.onclick = self.clickEdit;
          //editButton.click = this();
          td3.appendChild(editButton);
          var td4 = document.createElement('td');
          td4.classList.add('col-xs-6');
          td4.textContent = item['description'];
          tr1.appendChild(td1);
          tr1.appendChild(td2);
          tr1.appendChild(td3);
          tr2.appendChild(td4);
          table.appendChild(tr1);
          table.appendChild(tr2);
        });
        panelContent.appendChild(table);

        panel.appendChild(panelHeading);
        panel.appendChild(panelContent);

        accordion.appendChild(panel);

        $('#main').html(accordion);

        $.material.init();

      });

    },

    clickEdit(event) {

      var btn = event.target;
      window.dispatchEvent(new CustomEvent('setNavbar', {
        detail: {
          page: 'navbar-edit'
        }
      }));
      window.dispatchEvent(new CustomEvent('setPage', {
        detail: {
          page: 'page-edit',
          id: parseInt(btn.id)
        }
      }));

    }

  }

  exports.PageList = PageList;

})(window);