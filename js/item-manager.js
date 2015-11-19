(function (exports) {
  
  var ItemManager = function () {
    this._db = null;
  }

  ItemManager.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'addItem':
          this.addItem(event.detail);              
          break;
        case 'delItem':
          this.delItem(event.detail.id);
          break;
        case 'editItem':
          this.editItem(event.detail);
          break;
        case 'getItemById':
          if (event.detail.target == 'item-manager') {
            this.getItemById(event.detail.id, event.detail.source);
          }
          break;
        case 'getAllItems':
          if (event.detail.target == 'item-manager') {
            this.getAllItems(event.detail.source);
          }
          break;
        case 'getItemsByYearMonth':
          if (event.detail.target == 'item-manager') {
            this.getItemsByYearMonth(event.detail.source, event.detail.year_month);
          }
          break;
      }

    },

    initialize() {

      window.addEventListener('addItem', this);
      window.addEventListener('delItem', this);
      window.addEventListener('editItem', this);
      window.addEventListener('getItemById', this);
      window.addEventListener('getAllItems', this);
      window.addEventListener('getItemsByYearMonth', this);

      this._db = new Dexie("Budget");
      var db = this._db;
      db.version(1).stores({ items: "++id,category,date,price,description" });
      db.open();

    },

    setHint(msg, style){

      $('#hint').load('template/hint.html', function () {
        $('#hint-bg').addClass('alert-' + style);
        $('#hint-text').text(msg);
      });

    },

    addItem(data) {

      var db = this._db;
      var price = parseInt(data.price);
      var category = parseInt(data.category);
      var date = data.date;
      var description = data.description;

      db.items.add({ category: category, date: date, price: price, description: description })
        .then((function () {
          this.setHint('Successfully add a record', 'success');
        }).bind(this))
        .catch((function (reason) {
          this.setHint(reason, 'danger');
        }).bind(this));

    },

    delItem(id) {

      var db = this._db;
      id = parseInt(id);
      console.log(id);
      db.items
        .where('id')
        .equals(id)
        .delete()
        .then((function () {
          this.setHint('Successfully delete the record.', 'success');
        }).bind(this))
        .catch((function (reason) {
          this.setHint(reason, 'danger');
        }).bind(this));

    },

    editItem(data) {

      var db = this._db;
      var id = parseInt(data.id);
      var price = parseInt(data.price);
      var category = parseInt(data.category);
      var date = data.date;
      var description = data.description;
      db.items
        .where('id')
        .equals(id)
        .modify({ price: price, category: category, date: date, description: description })
        .then((function () {
          this.setHint('Successfully edit the record.', 'success');
        }).bind(this))
        .catch((function (reason) {
          this.setHint(reason, 'danger');
        }).bind(this));

    },

    getAllItems(source) {

      var db = this._db;
      db.items
        .orderBy('date')
        .reverse()
        .toArray()
        .catch((function (reason) {
          this.setHint(reason, 'danger');
        }).bind(this))
        .then(this.parseItems.bind(this))
        .then(function (items) {
          window.dispatchEvent(new CustomEvent('getAllItems', {
            detail: {
              target: source,
              items: items
            }
          }));
        })
        .catch(function (reason) {
          alert(reason);
        });
     
    },

    getItemsByYearMonth(source, year_month) {

      var db = this._db;
      db.items
        .where('date')
        .between(year_month + '-01', year_month + '-31', true, true)
        .toArray()
        .catch((function (reason) {
          this.setHint(reason, 'danger');
        }).bind(this))
        .then(this.parseItems.bind(this))
        .then(function (items) {
          window.dispatchEvent(new CustomEvent('getItemsByYearMonth', {
            detail: {
              target: source,
              items: items
            }
          }));
        });

    },

    getItemById(id, source){

      var db = this._db;
      id = parseInt(id);
      db.items
      .where('id')
      .equals(id)
      .toArray()
      .catch((function (reason) {
        this.setHint(reason, 'danger');
      }).bind(this))
      .then(function (item) {
        window.dispatchEvent(new CustomEvent('getItemById', {
          detail: {
            target: source,
            item: item[0]
          }
        }))
      })

    },

    parseItems(items) {

      items.forEach(function (element) {
        element['category'] = this(element['category']);
      }, this.categoryParse);
      return items;

    },    

    categoryParse(category) {

      switch (category) {
        case 0: return "Food";
        case 1: return "Tranportation";
        case 2: return "Others";
        default: return "undefined";
      }

    }

  }

  exports.ItemManager = ItemManager;

})(window);