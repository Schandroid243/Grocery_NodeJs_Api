const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGO_DB_CONFIG } = require("./config/app.config");
const errors = require("./middleware/errors");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

mongoose.Promise = global.Promise;

mongoose
  .connect(MONGO_DB_CONFIG.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("An error has occured:" + err.message);
  });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Here will be the routes and urls
app.use("/api", require("./routes/app.routes"));
//Errors handling
app.use(errors.errorHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || "192.168.91.193";

app.listen(PORT, IP, () => {
  console.log(`listening on port:  ${PORT} and ip: ${IP}`);
});
