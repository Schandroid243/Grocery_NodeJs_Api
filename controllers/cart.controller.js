const cartService = require("../services/cart.service");

exports.create = (req, res, next) => {
  var model = {
    userId: req.user.userId,
    products: req.body.products,
  };

  cartService.addCart(model, function (error, results) {
    if (error) {
      console.log("Error 1: " + error);
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.findAll = (req, res, next) => {
  cartService.getCart({ userId: req.user.userId }, function (error, results) {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.delete = (req, res, next) => {
  var model = {
    userId: req.user.userId,
    productId: req.body.productId,
    qty: req.body.qty,
  };

  cartService.removeCartItems(model, function (error, results) {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};
