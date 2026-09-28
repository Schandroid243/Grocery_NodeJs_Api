const { slider } = require("../models/slider.model");

const { MONGO_DB_CONFIG } = require("../config/app.config");

async function createSlider(params, callback) {
  if (!params.sliderName) {
    return callback({
      message: "Slider name must be provided",
    });
  }

  const model = new slider(params);
  model
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((err) => {
      return callback(err);
    });
}

async function getSliders(params, callback) {
  try {
    const sliderName = params.sliderName;
    const condition = sliderName
      ? { sliderName: { $regex: new RegExp(sliderName, "i") } }
      : {};

    const perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    const page = (Math.abs(params.page) || 1) - 1;

    const response = await slider
      .find(condition, "sliderName sliderImage")
      .skip(perPage * page)
      .limit(perPage)
      .exec(); // Add .exec() to explicitly execute the query

    return callback(null, response);
  } catch (error) {
    console.error(error);
    return callback(error);
  }
}

async function getSliderById(params, callback) {
  const sliderId = params.sliderId;

  slider
    .findById(sliderId)
    .then((response) => {
      if (!response) {
        return callback("Not found");
      } else return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function updateSlider(params, callback) {
  const sliderId = params.sliderId;

  slider
    .findByIdAndUpdate(sliderId, params, { useFindAndModify: false })
    .then((response) => {
      if (!response) {
        return callback("Not found");
      } else return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function deleteSlider(params, callback) {
  const sliderId = params.sliderId;

  slider
    .findByIdAndRemove(sliderId)
    .then((response) => {
      if (!response) {
        return callback("Not found");
      } else return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

module.exports = {
  createSlider,
  getSliders,
  getSliderById,
  updateSlider,
  deleteSlider,
};
