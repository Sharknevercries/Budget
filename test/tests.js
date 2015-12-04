var expect = chai.expect;
var should = chai.should();

describe('Database', function () {

  var database;
  var db;

  // Initialize database.
  before(function () {
    database = new Database();
    database.initialize();
    db = database._db;
  });

  // Clear stuff.
  afterEach(function () {
    db.items.clear();
    db.categories.clear();
  });

  describe('Initialize & addDefaultCategory', function () {
    
    it('Initialize and build a category with Others', function () {
    
      var exp = [{ id: 0, color: 'grey', description: 'Others' }];
      return db.categories
        .toArray()
        .then(function (ret) {
          expect(ret).to.eql(exp);
        })
      
    });

  });

  describe('Items', function () {

    describe('AddItem', function () {

      it('Add items with string price or category', function () {

        var items = [{ price: 50, category: 0, date: "2015-12-25", description: "asdf5" },
                    { price: 100, category: "3", date: "2015-12-26", description: "borjh" },
                    { price: "150", category: 2, date: "2015-12-27", description: "rbomk" },
                    { price: "2000", category: 1, date: "2015-12-28", description: "qokmd" }];
        var exps = [{ price: 50, category: 0, date: "2015-12-25", description: "asdf5" },
                    { price: 100, category: 3, date: "2015-12-26", description: "borjh" },
                    { price: 150, category: 2, date: "2015-12-27", description: "rbomk" },
                    { price: 2000, category: 1, date: "2015-12-28", description: "qokmd" }];
        items.forEach(function (item) {
          database.addItem(item);
        })
        return db.items.toArray().then(function (ret) {
          expect(ret).to.be.an('array');
          expect(ret).to.have.length(items.length);
          ret.forEach(function (item, idx) {
            expect(item).to.have.all.keys(['id', 'price', 'category', 'date', 'description']);
            expect(item).to.have.property('price', exps[idx].price);
            expect(item).to.have.property('category', exps[idx].category);
            expect(item).to.have.property('date', exps[idx].date);
            expect(item).to.have.property('description', exps[idx].description);
          })
        })

      })

    })

    describe('EditItem', function () {

      it('Edit items with string price, category or id', function () {
        db.items.put({ id: 1, price: 10, category: 1, date: "2015-11-30", description: "qjwbni" });
        db.items.put({ id: 2, price: 14, category: 0, date: "2015-11-10", description: "dqhfe" });
        db.items.put({ id: 3, price: 20, category: 2, date: "2015-11-20", description: "qhrrh" });
        database.editItem({ id: 1, price: "40", category: 0, date: "2015-09-05", description: "Change2" });
        database.editItem({ id: "2", price: 50, category: "1", date: "2015-09-04", description: "Change2" });
        database.editItem({ id: "3", price: "60", category: "1", date: "2015-09-03", description: "Change2" });
        var exps = [{ id: 1, price: 40, category: 0, date: "2015-09-05", description: "Change2" },
                    { id: 2, price: 50, category: 1, date: "2015-09-04", description: "Change2" },
                    { id: 3, price: 60, category: 1, date: "2015-09-03", description: "Change2" }];
        return db.items.toArray().then(function (ret) {
          expect(ret).to.eql(exps);
        });

      });

    });

    describe('DelItem', function () {

      it('Delete items', function () {

        db.items.put({ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" });
        db.items.put({ id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" });
        db.items.put({ id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" });
        db.items.put({ id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" });
        db.items.put({ id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" });
        db.items.put({ id: 6, price: 1, category: 4, date: "2015-11-01", description: "Gas" });
        db.items.put({ id: 7, price: 18, category: 0, date: "2015-09-01", description: "Forest" });
        db.items.put({ id: 8, price: 221, category: 1, date: "2015-10-01", description: "Hill" });
        database.delItem(4);
        database.delItem(3);
        database.delItem(7);
        var exps = [{ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" },
                    { id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" },
                    { id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" },
                    { id: 6, price: 1, category: 4, date: "2015-11-01", description: "Gas" },
                    { id: 8, price: 221, category: 1, date: "2015-10-01", description: "Hill" }];
        return db.items.toArray().then(function (items) {
          expect(items).to.eql(exps);
        })

      })

    });

    describe('getAllItems', function () {

      it('There is no item', function () {

        var exp = [];
        return database.getAllItems().then(function (ret) {
          expect(ret).to.eql(exp);
        })

      }) 
      
      it('There are items sort with date', function(){

        db.items.put({ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" });
        db.items.put({ id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" });
        db.items.put({ id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" });
        db.items.put({ id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" });
        db.items.put({ id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" });
        var exps = [{ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" },
                    { id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" },
                    { id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" },
                    { id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" },
                    { id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" }];
        return database.getAllItems().then(function(ret){
          expect(ret).to.eql(exps);
        })

      })

    })

    describe('getItemsById', function () {

      it('id', function () {

        db.items.put({ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" });
        db.items.put({ id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" });
        db.items.put({ id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" });
        db.items.put({ id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" });
        db.items.put({ id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" });
        var exp = [{ id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" }];
        return database.getItemById(3).then(function (ret) {
          expect(ret).to.eql(exp);
        })

      })

      it('id with string', function () {

        db.items.put({ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" });
        db.items.put({ id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" });
        db.items.put({ id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" });
        db.items.put({ id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" });
        db.items.put({ id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" });
        var exp = [{ id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" }];
        return database.getItemById("4").then(function (ret) {
          expect(ret).to.eql(exp);
        })

      })

    })

    describe('getItemsByYearMonth', function () {

      it('get nothing', function () {

        var exp = [];
        return database.getItemsByYearMonth('2015-02').then(function (ret) {
          expect(ret).to.eql(exp);
        })

      })

      it('get items sort by date reverse', function () {

        db.items.put({ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" });
        db.items.put({ id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" });
        db.items.put({ id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" });
        db.items.put({ id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" });
        db.items.put({ id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" });
        db.items.put({ id: 6, price: 1, category: 4, date: "2015-11-01", description: "Gas" });
        db.items.put({ id: 7, price: 18, category: 0, date: "2015-09-01", description: "Forest" });
        db.items.put({ id: 8, price: 221, category: 1, date: "2015-10-01", description: "Hill" });
        var exps = [{ id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" },
                    { id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" },
                    { id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" },
                    { id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" },
                    { id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" },
                    { id: 6, price: 1, category: 4, date: "2015-11-01", description: "Gas" }];
        return database.getItemsByYearMonth('2015-11').then(function (ret) {
          expect(ret).to.eql(exps);
        })

      })

    })

    describe('parseItems', function () {

      it('parse 1', function () {

        db.categories.put({ id: 1, color: "red", description: "Apple" });
        db.categories.put({ id: 2, color: "blue", description: "Bnana" });
        db.categories.put({ id: 3, color: "green", description: "Riven" });
        db.categories.put({ id: 4, color: "brown", description: "Elf" });
        db.categories.put({ id: 5, color: "black", description: "Pencil" });
        var items = [ { id: 1, price: 10, category: 1, date: "2015-11-30", description: "Apple" },
                      { id: 2, price: 14, category: 0, date: "2015-11-10", description: "Bnana" },
                      { id: 3, price: 20, category: 2, date: "2015-11-20", description: "CCLemon" },
                      { id: 4, price: 50, category: 5, date: "2015-11-11", description: "DCard" },
                      { id: 5, price: 70, category: 3, date: "2015-11-24", description: "Elf" },
                      { id: 6, price: 1, category: 4, date: "2015-11-01", description: "Gas" },
                      { id: 7, price: 18, category: 6, date: "2015-09-01", description: "Forest" },
                      { id: 8, price: 221, category: 1, date: "2015-10-01", description: "Hill" }];
        var exps = [{ id: 1, price: 10, category: "Apple", date: "2015-11-30", description: "Apple", color: "red" },
                    { id: 2, price: 14, category: "Others", date: "2015-11-10", description: "Bnana", color: "grey" },
                    { id: 3, price: 20, category: "Bnana", date: "2015-11-20", description: "CCLemon", color: "blue" },
                    { id: 4, price: 50, category: "Pencil", date: "2015-11-11", description: "DCard", color: "black" },
                    { id: 5, price: 70, category: "Riven", date: "2015-11-24", description: "Elf", color: "green" },
                    { id: 6, price: 1, category: "Elf", date: "2015-11-01", description: "Gas", color: "brown" },
                    { id: 7, price: 18, category: "Others", date: "2015-09-01", description: "Forest", color: "grey" },
                    { id: 8, price: 221, category: "Apple", date: "2015-10-01", description: "Hill", color: "red" }];
        return database.parseItems(items).then(function (ret) {
          expect(ret).to.eql(exps);
        })

      })

    })

  });

  describe('Categories', function () {

    describe('AddCategory', function () {

      it('Add categories', function () {

        var categories = [{ color: "grey", description: "Food" },
                          { color: "red", description: "Drinks" },
                          { color: "orange", description: "Transportation" },
                          { color: "blue", description: "Doctor" }];
        var exps = [{ color: "grey", description: "Food" },
                    { color: "red", description: "Drinks" },
                    { color: "orange", description: "Transportation" },
                    { color: "blue", description: "Doctor" }];;
        categories.forEach(function (category) {
          database.addCategory(category);
        })
        return db.categories.toArray().then(function (ret) {
          expect(ret).to.be.an('array');
          expect(ret).to.have.length(categories.length);
          ret.forEach(function (item, idx) {
            expect(item).to.an('object');
            expect(item).to.have.all.keys(['id', 'color', 'description']);
            expect(item).to.have.property('color', exps[idx].color);
            expect(item).to.have.property('description', exps[idx].description);
          })
        })

      })

    })

    describe('EditCategory', function () {

      it('Edit categories with string id', function () {

        db.categories.put({ id: 1, color: "red", description: "Apple" });
        db.categories.put({ id: 2, color: "blue", description: "Bnana" });
        db.categories.put({ id: 3, color: "green", description: "Riven" });
        db.categories.put({ id: 4, color: "brown", description: "Elf" });
        db.categories.put({ id: 5, color: "black", description: "Pencil" });
        database.editCategory({ id: 2, color: "yellow", description: "Banan" });
        database.editCategory({ id: 5, color: "blue", description: "Coffee" });
        database.editCategory({ id: "2", color: "red", description: "Food" });
        database.editCategory({ id: "4", color: "blue", description: "G_G" });
        var exps = [{ id: 1, color: "red", description: "Apple" },
                    { id: 2, color: "red", description: "Food" },
                    { id: 3, color: "green", description: "Riven" },
                    { id: 4, color: "blue", description: "G_G" },
                    { id: 5, color: "blue", description: "Coffee" }];
        return db.categories.toArray().then(function (ret) {
          expect(ret).to.eql(exps);
        })

      });

    });

    describe('delCategory', function () {

      it('Delete categories', function () {

        db.categories.put({ id: 1, color: "red", description: "Apple" });
        db.categories.put({ id: 2, color: "blue", description: "Bnana" });
        db.categories.put({ id: 3, color: "green", description: "Riven" });
        db.categories.put({ id: 4, color: "brown", description: "Elf" });
        db.categories.put({ id: 5, color: "black", description: "Pencil" });
        database.delCategory(3);
        database.delCategory("1");
        database.delCategory("4");
        var exps = [{ id: 2, color: "blue", description: "Bnana" },
                    { id: 5, color: "black", description: "Pencil" }]
        return db.categories.toArray().then(function (ret) {
          expect(ret).to.eql(exps);
        })

      })

    })

    describe('getAllCategories', function () {

      it('There is no category', function () {

        var exp = [];
        return database.getAllCategories().then(function (categories) {
          expect(categories).to.eql(exp);
        })

      })

      it('There are items in DB sort with date', function () {

        db.categories.put({ id: 1, color: "grey", description: "WOW" });
        db.categories.put({ id: 2, color: "blue", description: "sOT" });
        db.categories.put({ id: 3, color: "green", description: "AdfOM" });
        db.categories.put({ id: 4, color: "yello", description: "CdfOM" });
        db.categories.put({ id: 5, color: "asdgl", description: "76Gasdf9" });

        var exps = [{ id: 2, color: "blue", description: "sOT" },
                    { id: 1, color: "grey", description: "WOW" },
                    { id: 4, color: "yello", description: "CdfOM" },
                    { id: 3, color: "green", description: "AdfOM" },
                    { id: 5, color: "asdgl", description: "76Gasdf9" }];

        return database.getAllCategories().then(function (categories) {
          expect(categories).to.eql(exps);
        })

      })

    })

    describe('getCategoryById', function () {

      it('get category 1', function () {

        db.categories.put({ id: 1, color: "grey", description: "WOW" });
        db.categories.put({ id: 2, color: "blue", description: "sOT" });
        db.categories.put({ id: 3, color: "green", description: "AdfOM" });
        db.categories.put({ id: 4, color: "yello", description: "CdfOM" });
        db.categories.put({ id: 5, color: "asdgl", description: "76Gasdf9" });
        var exp = [];
        return database.getCategoryById("0").then(function (categories) {
          expect(categories).to.eql(exp);
        })

      })

      it('get category 2', function () {

        db.categories.put({ id: 1, color: "grey", description: "WOW" });
        db.categories.put({ id: 2, color: "blue", description: "sOT" });
        db.categories.put({ id: 3, color: "green", description: "AdfOM" });
        db.categories.put({ id: 4, color: "yello", description: "CdfOM" });
        db.categories.put({ id: 5, color: "asdgl", description: "76Gasdf9" });
        var exp = [{ id: 2, color: "blue", description: "sOT" }];
        return database.getCategoryById(2).then(function (ret) {
          expect(ret).to.eql(exp);
        })

      })

      it('get category 3', function () {

        db.categories.put({ id: 1, color: "grey", description: "WOW" });
        db.categories.put({ id: 2, color: "blue", description: "sOT" });
        db.categories.put({ id: 3, color: "green", description: "AdfOM" });
        db.categories.put({ id: 4, color: "yello", description: "CdfOM" });
        db.categories.put({ id: 5, color: "asdgl", description: "76Gasdf9" });
        var exp = [{ id: 4, color: "yello", description: "CdfOM" }];
        return database.getCategoryById("4").then(function (ret) {
          expect(ret).to.eql(exp);
        })

      })

      it('get category 4', function () {

        db.categories.put({ id: 1, color: "grey", description: "WOW" });
        db.categories.put({ id: 2, color: "blue", description: "sOT" });
        db.categories.put({ id: 3, color: "green", description: "AdfOM" });
        db.categories.put({ id: 4, color: "yello", description: "CdfOM" });
        db.categories.put({ id: 5, color: "asdgl", description: "76Gasdf9" });
        var exp = [];
        return database.getCategoryById(6).then(function (ret) {
          expect(ret).to.eql(exp);
        })

      })

    })

  });  

});

describe('page-item-list', function () {

  it('calculateYearMonthSum', function () {

    var pageItemList = new PageItemList();
    // items should be in order by date reverse.
    var items = [{ id: 1, price: 100, category: "asdn", date: "2015-12-26", description: "borjh" },
                 { id: 0, price: 50, category: "Others", date: "2015-12-25", description: "asdf5" },
                 { id: 3, price: 2000, category: "AWDNOW", date: "2015-11-28", description: "qokmd" },
                 { id: 2, price: 150, category: "wnHOJ", date: "2015-10-27", description: "rbomk" }];
    var exps = {
      '2015-12': {
        'sum': 150,
        'items': [
          { id: 1, price: 100, category: "asdn", date: "2015-12-26", description: "borjh" },
          { id: 0, price: 50, category: "Others", date: "2015-12-25", description: "asdf5" }
        ]
      },
      '2015-11': {
        'sum': 2000,
        'items': [
          { id: 3, price: 2000, category: "AWDNOW", date: "2015-11-28", description: "qokmd" }
        ]
      },
      '2015-10': {
        'sum': 150,
        'items': [
          { id: 2, price: 150, category: "wnHOJ", date: "2015-10-27", description: "rbomk" }
        ]
      }
    };

    var ret = pageItemList.calculateYearMonthSum(items);
    expect(ret).to.eql(exps);

  })

})

describe('page-home', function () {

  it('calculateCategoriesInfo', function () {

    var pageHome = new PageHome();
    // items' category should be converted to string and have color
    // items should be sorted in order by date reverse then id.
    var items = [{ id: 3, price: 2000, category: "AWDNOW", date: "2015-12-28", description: "qokmd", color: "blue" },
                 { id: 2, price: 150, category: "wnHOJ", date: "2015-12-27", description: "rbomk", color: "red" },
                 { id: 1, price: 100, category: "Others", date: "2015-12-26", description: "borjh", color: "grey" },
                 { id: 0, price: 50, category: "Others", date: "2015-12-25", description: "asdf5", color: "grey" }];
    var exps = {
      categoryInfo: {
        'AWDNOW': {
          sum: 2000,
          color: 'blue'
        },
        'wnHOJ': {
          sum: 150,
          color: 'red'
        },
        'Others': {
          sum: 150,
          color: 'grey'
        }
      },
      totalSum: 2300
    };
    var ret = pageHome.calculateCategoriesInfo(items);
    expect(ret).to.eql(exps);

  })

})