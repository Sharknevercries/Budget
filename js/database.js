(function (exports) {
  
  var Database = function () {

    this._db = null;
    
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
          this.addItem(event.detail)
              .then((function () {
                this.showHint('success', 'Success', 'Add a record.');
              }).bind(this))
              .catch((function (reason) {
                this.showHint('error', 'Error', reason);
              }).bind(this));
          break;
        case 'delItem':
          this.delItem(event.detail.id)
              .then((function () {
                this.showHint('success', 'Success', 'Delete the record.');
              }).bind(this))
              .catch((function (reason) {
                this.showHint('error', 'Error', reason);
              }).bind(this));
          break;
        case 'editItem':
          this.editItem(event.detail)
              .then((function () {
                this.showHint('success', 'Success', 'Edit the record.');
              }).bind(this))
              .catch((function (reason) {
                this.showHint('error', 'Error', reason);
              }).bind(this));
          break;
        case 'getItemById':
          if (event.detail.target == 'database') {
            this.getItemById(event.detail.id)
                .then(function (items) {
                  return items[0];
                })
                .catch((function (reason) {
                  // It should not happen.
                  this.showHint('error', 'Error', reason);
                  return [];
                }).bind(this))
                .then((function (item) {
                  this.response(item, event.detail.source, event.type);
                }).bind(this));
          }
          break;
        case 'getAllItems':
          if (event.detail.target == 'database') {
            this.getAllItems()
                .then(function (items) {
                  return items;
                })
                .catch((function (reason) {
                  // should not happen
                  this.showHint('error', 'Error', reason);
                  return [];
                }).bind(this))
                .then(this.parseItems.bind(this))
                .catch((function (reason) {
                  // should not happen
                  this.showHint('error', 'Error', reason);
                  return [];
                }).bind(this))
                .then((function (items) {
                  this.response(items, event.detail.source, event.type);
                }).bind(this))
          }
          break;
        case 'getItemsByYearMonth':
          if (event.detail.target == 'database') {
            this.getItemsByYearMonth(event.detail.year_month)
                .then(function (items) {
                    return items;
                  })
                .catch(function (reason) {
                  // should not happen
                  this.showHint('error', 'Error', reason);
                  return [];
                })
                .then(this.parseItems.bind(this))
                .catch((function (reason) {
                  // should not happen
                  this.showHint('error', 'Error', reason);
                  return [];
                }).bind(this))
                .then((function (items) {
                  this.response(items, event.detail.source, event.type);
                }).bind(this));
          }
          break;

        //
        //
        //  Categories
        //
        //

        case 'addCategory':
          this.addCategory(event.detail)
              .then((function () {
                this.showHint('success', 'Success', 'Add a category.');
              }).bind(this))
              .catch((function (reason) {
                this.showHint('error', 'Error', reason);
              }).bind(this))
          break;
        case 'editCategory':
          this.editCategory(event.detail)
              .then((function () {
                this.showHint('success', 'Success', 'Edit the category.');
              }).bind(this))
              .catch((function (reason) {
                this.showHint('error', 'Error', reason);
              }).bind(this))
          break;
        case 'delCategory':
          this.delCategory(event.detail.id)
              .then((function () {
                this.showHint('success', 'Success', 'Delete the category.');
              }).bind(this))
              .catch((function (reason) {
                this.showHint('error', 'Error', reason);
              }).bind(this))
          break;
        case 'getAllCategories':
          if (event.detail.target == 'database') {
            this.getAllCategories()
                .then(function (categories) {
                  return categories;
                })
                .catch((function (reason) {
                  // It should not happen.
                  this.showHint('error', 'Error', reason);
                  return [];
                }).bind(this))
                .then((function (categories) {
                  this.response(categories, event.detail.source, event.type);
                }).bind(this));
          }
          break;
        case 'getCategoryById':
          if (event.detail.target == 'database') {
            this.getCategoryById(event.detail.id)
                .then(function (categories) {
                  return categories[0];
                })
                .catch((function (reason) {
                  // It should not happen.
                  this.showHint('error', 'Error', reason);
                  return [];
                }).bind(this))
                .then((function (category) {
                  this.response(category, event.detail.source, event.type);
                }).bind(this));
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
      
      this.addDefaultCategory();

    },

    addDefaultCategory() {

      var db = this._db;
      db.categories
        .put({ id: 0, color: "grey", description: "Others" })
        .catch((function (reason) {
          this.showHint('error', 'Error', reason);
        }).bind(this));

    },

    showHint(type, title, msg){
      
      toastr[type](msg, title, { timeOut: 3000, positionClass: 'toast-bottom-center', preventDuplicates: true });

    },

    response(ret, target, event){

      window.dispatchEvent(new CustomEvent(event, { detail: { target: target, result: ret } }));

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

      return db.items.add({ category: category, date: date, price: price, description: description })

    },

    delItem(id) {

      var db = this._db;
      id = parseInt(id);
      return db.items.where('id').equals(id).delete()

    },

    editItem(data) {

      var db = this._db;
      var id = parseInt(data.id);
      var price = parseInt(data.price);
      var category = parseInt(data.category);
      var date = data.date;
      var description = data.description;
      return db.items.where('id').equals(id).modify({ price: price, category: category, date: date, description: description })
        

    },

    getAllItems() {

      var db = this._db;
      return db.items.orderBy('date').reverse().toArray()

    },

    getItemsByYearMonth(year_month) {

      var db = this._db;
      return db.items.where('date').between(year_month + '-01', year_month + '-31', true, true).reverse().toArray()
        
    },

    getItemById(id){

      var db = this._db;
      id = parseInt(id);
      return db.items.where('id').equals(id).toArray()
        
    },
    
    parseItems(items) {

      var db = this._db;
      return db.categories
            .toArray()
            .then((function (categories) {

              var hashTable = {};
              categories.forEach(function (element) {
                hashTable[element['id']] = {};
                hashTable[element['id']]['description'] = element['description'];
                hashTable[element['id']]['color'] = element['color'];
              })
              items.forEach(function (element) {
                var idx = element['category'];
                if (!hashTable[idx]) {
                  element['category'] = "Others"; // Defualt value
                  element['color'] = "grey";
                }
                else {
                  element['category'] = hashTable[idx]['description'];
                  element['color'] = hashTable[idx]['color'];
                }
              });
              return items;

            }).bind(this))
        

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

      return db.categories.add({ color: color, description: description })        

    },

    editCategory(data){

      var db = this._db;
      var id = parseInt(data.id);
      var color = data.color;
      var description = data.description;
      return db.categories.where('id').equals(id).modify({ color: color, description: description })

    },

    delCategory(id){

      var db = this._db;
      id = parseInt(id);
      return db.categories.where('id').equals(id).delete()
        
    },

    getAllCategories() {

      var db = this._db;
      return db.categories.orderBy('description').reverse().toArray()
        

    },

    getCategoryById(id){

      var db = this._db;
      id = parseInt(id);
      return db.categories.where('id').equals(id).toArray()
        
    }

  }

  exports.Database = Database;

})(window);