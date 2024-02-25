const { cart } = require("../models/cart.model");
var async = require("async");

async function addCart(params, callback) {
  if (!params.userId) {
    return callback({
      message: "User id is required !",
    });
  }
  cart.findOne({ userId: params.userId }, function (err, cartDB) {
    if (err) {
      return callback(err);
    } else {
      if (cartDB == null) {
        const cartModel = new cart({
          userId: params.userId,
          products: params.products,
        });
        cartModel
          .save()
          .then((response) => {
            return callback(null, response);
          })
          .catch((err) => {
            return callback(err);
          });
      }
    }
  });
}
