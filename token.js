require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET || "demosecret";
exports.sign = (name, user) => {
  return new Promise((resolve) => {
    if (!user) return resolve(null);
    jwt.sign({ id: user._id, name }, SECRET, (e, d) => {
      if (e) return resolve(null);
      return resolve(d);
    });
  });
};

exports.verify = (token, k) => {
  return new Promise((resolve) => {
    jwt.verify(token, SECRET, (e, d) => {
      if (e) return resolve(null);
      return resolve(d);
    });
  });
};
