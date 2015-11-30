(function (exports) {
  
  var Database = function () {

    this._db = null;
    this._categories = null;
    
  }

  Database.prototype = {

    handleEvent(event) {

      switch (event.type) {

        //
        //
        //  Items
        //
        //

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
          if (event.detail.target == 'database') {
            this.getItemById(event.detail.id, event.detail.source);
          }
          break;
        case 'getAllItems':
          if (event.detail.target == 'database') {
            this.getAllItems(event.detail.source);
          }
          break;
        case 'getItemsByYearMonth':
          if (event.detail.target == 'database') {
            this.getItemsByYearMonth(event.detail.source, event.detail.year_month);
          }
          break;

        //
        //
        //  Categories
        //
        //

        case 'addCategory':
          this.addCategory(event.detail);
          break;
        case 'editCategory':
          this.editCategory(event.detail);
          break;
        case 'delCategory':
          this.delCategory(event.detail.id);
          break;
        case 'getAllCategories':
          if (event.detail.target == 'database') {
            this.getAllCategories(event.detail);
          }
          break;
        case 'getCategoryById':
          if (event.detail.target == 'database') {
            this.getCategoryById(event.detail.id, event.detail.source);
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

      window.addEventListener('addCategory', this);
      window.addEventListener('editCategory', this);
      window.addEventListener('delCategory', this);
      window.addEventListener('getAllCategories', this);
      window.addEventListener('getCategoryById', this);

      this._db = new Dexie("Budget");
      var db = this._db;
      db.version(2).stores({
        items: "++id,category,date,price,description",
        categories: "++id,color,description"
      });
      db.version(1).stores({
        items: "++id,category,date,price,description",
        categories: "++id,color,description"
      });
      db.open();

      db.categories
        .put({ id: 0, color: "grey", description: "Others" })
      .catch(function (reason) {
        alert(reason);
      });
      
      this.updateCategoriesList();

    },

    showHint(type, title, msg){
      
      toastr[type](msg, title, { timeOut: 3000, positionClass: 'toast-bottom-center' });

    },

    //
    //
    //  Items
    //
    //

    addItem(data) {

      var db = this._db;
      var price = parseInt(data.price);
      var category = parseInt(data.category);
      var date = data.date;
      var description = data.description;

      db.items.add({ category: category, date: date, price: price, description: description })
        .then((function () {
          this.showHint('success', 'Success', 'Add a record.');
        }).bind(this))
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this));

    },

    delItem(id) {

      var db = this._db;
      id = parseInt(id);
      db.items
        .where('id')
        .equals(id)
        .delete()
        .then((function () {
          this.showHint('success', 'Success', 'Delete the record.');
        }).bind(this))
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
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
          this.showHint('success', 'Success', 'Edit the record.');
        }).bind(this))
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this));

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
        .catch((function (reason) {
          // Typically, there is no item in category.
          window.dispatchEvent(new CustomEvent('getAllItems', {
            detail: {
              target: source,
              items: null
            }
          }));
        }).bind(this));
     
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
        })
        .catch((function (reason) {
          // Typically, there is no item in category.
          window.dispatchEvent(new CustomEvent('getItemsByYearMonth', {
            detail: {
              target: source,
              items: null
            }
          }));
        }).bind(this));

    },

    getItemById(id, source){

      var db = this._db;
      id = parseInt(id);
      db.items
        .where('id')
        .equals(id)
        .toArray()
        .then(function (items) {
          window.dispatchEvent(new CustomEvent('getItemById', {
            detail: {
              target: source,
              item: items[0]
            }
          }))
        })
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this));

    },
    
    parseItems(items) {

      var categories = this._categoriesList;
      var hashTable = {};
      categories.forEach(function (element) {
        hashTable[element['id']] = {};
        hashTable[element['id']]['description'] = element['description'];
        hashTable[element['id']]['color'] = element['color'];
      })
      items.forEach(function (element) {
        var idx = element['category'];
        if (!hashTable[idx]) {
          element['category'] = hashTable[0]['description']; // Defualt value
          element['color'] = hashTable[0]['color'];
        }
        else {
          element['category'] = hashTable[idx]['description'];
          element['color'] = hashTable[idx]['color'];
        }
      });
      return items;

    },

    //
    //
    //  Categories
    //
    //

    addCategory(data){

      var db = this._db;
      var color = data.color;
      var description = data.description;

      db.categories.add({ color: color, description: description })
        .then((function () {
          this.showHint('success', 'Success', 'Add a category.');
        }).bind(this))
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this))
        .then(this.updateCategoriesList.bind(this));

    },

    editCategory(data){

      var db = this._db;
      var id = parseInt(data.id);
      var color = data.color;
      var description = data.description;
      console.log(data);
      db.categories
        .where('id')
        .equals(id)
        .modify({ color: color, description: description })
        .then((function () {
          this.showHint('success', 'Success', 'Edit the category.');
        }).bind(this))
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this))
        .then(this.updateCategoriesList.bind(this));

    },

    delCategory(id){

      var db = this._db;
      id = parseInt(id);
      db.categories
        .where('id')
        .equals(id)
        .delete()
        .then((function () {
          this.showHint('success', 'Success', 'Delete the category.');
        }).bind(this))
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this))
        .then(this.updateCategoriesList.bind(this));

    },

    getAllCategories(data) {

      var db = this._db;
      db.categories
        .orderBy('description')
        .reverse()
        .toArray()
        .then(function (categories) {
          window.dispatchEvent(new CustomEvent('getAllCategories', {
            detail: {
              target: data.source,
              categories: categories
            }
          }));
        })
        .catch((function (reason) {
          // Typically, there is no item in category.
          window.dispatchEvent(new CustomEvent('getAllCategories', {
            detail: {
              target: data.source,
              categories: null
            }
          }));
        }).bind(this));

    },

    getCategoryById(id, source){

      var db = this._db;
      id = parseInt(id);
      db.categories
        .where('id')
        .equals(id)
        .toArray()
        .then(function (categories) {
          window.dispatchEvent(new CustomEvent('getCategoryById', {
            detail: {
              target: source,
              category: categories[0]
            }
          }))
        })
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this));

    },

    updateCategoriesList() {

      var db = this._db;
      db.categories
        .toArray()
        .then((function (categories) {
          this._categoriesList = categories;
        }).bind(this))
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this));

    }

  }

  exports.Database = Database;

})(window);