const { MONGO_DB_CONFIG } = require("../config/app.config");
const { category } = require("../models/category.model");

exports.createCategory = (params, callback) => {
  if (!params.categoryName) {
    return callback(
      {
        message: "Category name must be provided",
      },
      ""
    );
  }

  const model = new category(params);
  model
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
};

exports.getCategories = (params, callback) => {
  const categoryName = params.categoryName;
  var condition = categoryName
    ? {
        categoryName: { $regex: new RegExp(categoryName), $options: "i" },
      }
    : {};
  let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
  let page = (Math.abs(params.page) || 1) - 1;

  category
    .find(condition, "categoryName categoryImage")
    .limit(perPage)
    .skip(perPage * page)
    .then((response) => {
      return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
};

exports.getCategoryById = (params, callback) => {
  const categoryId = params.categoryId;

  category
    .findById(categoryId)
    .then((response) => {
      if (!response) {
        callback("Category not found");
      } else return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
};

exports.updateCategory = (params, callback) => {
  const categoryId = params.categoryId;

  category
    .findByIdAndUpdate(categoryId, params, { useFindAndModify: false })
    .then((response) => {
      if (!response) {
        callback("Category not found");
      } else return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
};

exports.deleteCategory = (params, callback) => {
  const categoryId = params.categoryId;

  category
    .findByIdAndDelete(categoryId)
    .then((response) => {
      if (!response) {
        callback("Category not found");
      } else return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
};
