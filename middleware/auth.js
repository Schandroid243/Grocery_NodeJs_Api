const jwt = require("jsonwebtoken");
const { TOKEN_KEY, tokenLife } = require("../config/configToken");

const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //if (token === null) return res.sendStatus(401);

  if (!token) {
    return res.status(403).send({ message: "No token provided !" });
  }

  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) return res.status(401).send({ message: "Unauthorized !" });
    req.user = user.data;
    next();
  });
};

const generateAccessToken = (userModel) => {
  return jwt.sign(
    {
      data: userModel,
    },
    TOKEN_KEY,
    {
      expiresIn: tokenLife,
    }
  );
};

module.exports = {
  authenticationToken,
  generateAccessToken,
};
