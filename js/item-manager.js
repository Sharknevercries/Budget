(function (exports) {
  
  var ItemManager = function () {
    this._db = null;
  }

  ItemManager.prototype = {

    handleEvent(event) {

      switch (event.type) {
        case 'addItem':
          this.addItem(event.detail)
              .then(function () {
                $('#page-home').click();
                $('#hint').load('hint.html', function () {
                  $('#hint-bg').addClass('alert-success');
                  $('#hint-text').text("Succesfully Add.");
                });
              })
              .catch(function (reason) {
                $('#page-home').click();
                $('#hint').load('hint.html', function () {
                  $('#hint-bg').addClass('alert-danger');
                  $('#hint-text').text(reason);
                });
              });
          break;
        case 'delItem':
          break;
        case 'editItem':
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
      window.addEventListener('getAllItems', this);
      window.addEventListener('getItemsByYearMonth', this);

      this._db = new Dexie("Budget");
      var db = this._db;
      db.version(1).stores({ items: "++id,category,date,price,description" });
      db.open();

    },

    addItem(data) {

      return new Promise((function (resolve, reject) {

        var db = this._db;
        var price = parseInt(data.price);
        var category = parseInt(data.category);
        var date = data.date;
        var description = data.description;

        if (!Number.isInteger(price) || price < 0)
          reject("Price is negative or is not integer.");

        db.items.add({ category: category, date: date, price: price, description: description })
          .then(resolve);

      }).bind(this));

    },

    delItem(data) {

    },

    editItem(data) {

    },

    getAllItems(source) {

      var db = this._db;
      db.items
        .orderBy('date')
        .reverse()
        .toArray()
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