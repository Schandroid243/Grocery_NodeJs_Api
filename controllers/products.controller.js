const productService = require("../services/products.service");
const upload = require("../middleware/product.upload");

//Refactor all the methods by adding all the operations inside a try catch block
exports.create = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return next(err);
    } else {
      const path =
        req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

      var model = {
        productName: req.body.productName,
        category: req.body.category,
        productShortDescription: req.body.productShortDescription,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productSalePrice: req.body.productSalePrice,
        productSKU: req.body.productSKU,
        productType: req.body.productType,
        stockStatus: req.body.stockStatus,
        productImage: path != "" ? "/" + path : "",
      };

      productService.createProduct(model, (err, results) => {
        if (err) {
          return next(err);
        } else {
          return res.status(200).send({
            message: "Success",
            data: results,
          });
        }
      });
    }
  });
};

exports.findAll = (req, res, next) => {
  var model = {
    productIds: req.query.productIds,
    productName: req.query.productName,
    categoryId: req.query.categoryId,
    pageSize: req.query.pageSize,
    page: req.query.page,
    sort: req.query.sort,
  };

  productService.getProducts(model, (err, results) => {
    if (err) {
      return next(err);
    } else {
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    }
  });
};

exports.findOne = (req, res, next) => {
  var model = {
    productId: req.params.id,
  };

  productService.getProductById(model, (err, results) => {
    if (err) {
      return next(err);
    } else {
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    }
  });
};

exports.update = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return next(err);
    } else {
      const path =
        req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

      var model = {
        productId: req.params.id,
        productName: req.body.productName,
        category: req.body.category,
        productShortDescription: req.body.productShortDescription,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productSalePrice: req.body.productSalePrice,
        productSKU: req.body.productSKU,
        productType: req.body.productType,
        stockStatus: req.body.stockStatus,
        productImage: path != "" ? "/" + path : "",
      };

      productService.updateProduct(model, (err, results) => {
        if (err) {
          return next(err);
        } else {
          return res.status(200).send({
            message: "Success",
            data: results,
          });
        }
      });
    }
  });
};

exports.delete = (req, res, next) => {
  var model = {
    productId: req.params.id,
  };

  productService.deleteProduct(model, (err, results) => {
    if (err) {
      return next(err);
    } else {
      return res.status(200).send({
        message: "Success",
        data: results,
      });
    }
  });
};
