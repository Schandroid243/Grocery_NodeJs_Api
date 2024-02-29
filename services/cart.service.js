const { cart } = require("../models/cart.model");
var async = require("async");

async function addCart(params, callback) {
  if (!params.userId) {
    console.log("Error 0: ");
    return callback({
      message: "User id is required !",
    });
  }
  cart
    .findOne({ userId: params.userId })
    .then((cartDB) => {
      if (!cartDB) {
        const cartModel = new cart({
          userId: params.userId,
          products: params.products,
        });

        return cartModel.save();
      } else if (cartDB.products.length === 0) {
        cartDB.products = params.products;
        return cartDB.save();
      } else {
        return Promise.all(
          params.products.map(async (product) => {
            let itemIndex = cartDB.products.findIndex(
              (p) => p.product == product.product
            );

            if (itemIndex === -1) {
              cartDB.products.push({
                product: product.product,
                qty: product.qty,
              });
            } else {
              cartDB.products[itemIndex].qty += product.qty;
            }
          })
        ).then(() => cartDB.save());
      }
    })
    .then((response) => {
      return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
}

async function getCart(params, callback) {
  try {
    const response = await cart.findOne({ userId: params.userId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: "Product",
        select: "productName productPrice productSalePrice productImage",
        populate: {
          path: "category",
          model: "category",
          select: "categoryName",
        },
      },
    });

    if (!response) {
      return callback(null, null); // or handle as needed
    }

    // Extract and format information
    const cartInfo = {
      cartId: response._id.toString(),
      userId: response.userId,
      products: response.products.map((product) => ({
        productId: product.product._id.toString(),
        productName: product.product.productName,
        productPrice: product.product.productPrice,
        productSalePrice: product.product.productSalePrice,
        productImage: product.product.productImage,
        category: {
          categoryId: product.product.category._id.toString(),
          categoryName: product.product.category.categoryName,
        },
        qty: product.qty,
        _id: product._id,
      })),
    };

    return callback(null, cartInfo);
  } catch (error) {
    return callback(error);
  }
}

// async function removeCartItems(params, callback) {
//   cart.findOne({ userId: params.userId }, function (err, cartDB) {
//     if (err) {
//       return callback(err);
//     } else {
//       if (params.productId && params.qty) {
//         const productId = params.productId;
//         const qty = params.qty;

//         if (cartDB.products.length === 0) {
//           return callback(null, "The cart is empty !");
//         } else {
//           let itemIndex = cartDB.products.findIndex(
//             (p) => p.product == productId
//           );
//           if (itemIndex === -1) {
//             return callback(null, "Invalid product !");
//           } else {
//             if (cartDB.products[itemIndex].qty === qty) {
//               cartDB.products.splice(itemIndex, 1);
//             } else if (cartDB.products[itemIndex].qty > qty) {
//               cartDB.products[itemIndex].qty =
//                 cartDB.products[itemIndex].qty - qty;
//             } else {
//               return callback(null, "Enter lower quantity");
//             }
//             cartDB.save((err, cartM) => {
//               if (err) {
//                 return callback(err);
//               }
//               return callback(null, "Cart Updated !");
//             });
//           }
//         }
//       }
//     }
//   });
// }

async function removeCartItems(params, callback) {
  try {
    const cartDB = await cart.findOne({ userId: params.userId }).exec();

    if (!cartDB) {
      return callback(null, "Cart not found !");
    }

    if (params.productId && params.qty) {
      const productId = params.productId;
      const qty = params.qty;

      if (cartDB.products.length === 0) {
        return callback(null, "The cart is empty !");
      } else {
        let itemIndex = cartDB.products.findIndex(
          (p) => p.product == productId
        );
        if (itemIndex === -1) {
          return callback(null, "Invalid product !");
        } else {
          if (cartDB.products[itemIndex].qty === qty) {
            cartDB.products.splice(itemIndex, 1);
          } else if (cartDB.products[itemIndex].qty > qty) {
            cartDB.products[itemIndex].qty =
              cartDB.products[itemIndex].qty - qty;
          } else {
            return callback(null, "Enter lower quantity");
          }

          await cartDB.save();

          return callback(null, "Cart Updated !");
        }
      }
    }
  } catch (err) {
    return callback(err);
  }
}

module.exports = {
  addCart,
  getCart,
  removeCartItems,
};
