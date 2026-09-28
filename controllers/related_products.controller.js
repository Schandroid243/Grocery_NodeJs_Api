const relatedProductServices = require("../services/related_product.service");

exports.create = (req, res, next) => {
  relatedProductServices.AddRelatedProduct(req.body, (error, results) => {
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
    id: req.params.id,
  };
  relatedProductServices.removeRelatedProduct(model, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};
