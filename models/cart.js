module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, id, count) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item : item, sales: 0, price: 0 };
      this.totalQty++;
    }
    let additionalPrice = count * storedItem.item.price;
    storedItem.sales = Number(storedItem.sales);
    storedItem.sales += count;
    storedItem.price += additionalPrice;
    this.totalPrice += additionalPrice;
  }

  this.reduceByOne = function (id) {
    if (this.items[id].sales <= 0) return;
    this.items[id].sales--;
    this.items[id].price -= this.items[id].item.price;
    this.totalPrice -= this.items[id].item.price;
  };

  this.addByOne = function (id) {
    this.items[id].sales++;
    this.items[id].price += this.items[id].item.price;
    this.totalPrice += this.items[id].item.price;
  };

  this.removeItem = function (id) {
    this.totalQty--;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };


  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
};