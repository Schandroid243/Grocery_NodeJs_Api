const jwt = require("jsonwebtoken");
const { TOKEN_KEY, tokenLife } = require("../config/configToken");

const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
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
