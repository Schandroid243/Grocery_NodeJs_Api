const { relatedProduct } = require("../models/related_product.model");
const { product } = require("../models/product.model");

async function AddRelatedProduct(params, callback) {
  if (!params.product) {
    return callback({
      message: "Product id is required !",
    });
  }

  if (!params.relatedProduct) {
    return callback({
      message: "Related product is is required !",
    });
  }

  const relatedProductModel = new relatedProduct(params);
  relatedProductModel
    .save()
    .then(async (response) => {
      await product.findOneAndUpdate(
        {
          _id: params.product,
        },
        {
          $addToSet: {
            relatedProducts: relatedProductModel,
          },
        }
      );
      return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
}

async function removeRelatedProduct(params, callback) {
  const id = params.id;

  relatedProduct
    .findByIdAndRemove(id)
    .then((response) => {
      if (!response) {
        callback("Product Id not found");
      } else {
        callback(null, response);
      }
    })
    .catch((error) => {
      return callback(error);
    });
}

module.exports = {
  AddRelatedProduct,
  removeRelatedProduct,
};
