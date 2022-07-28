const models = require("../models");
const user = {
  name: "faculty10",
  email: "faculty10@gmail.com",
  phone: "12345671090",
  password: "demo10",
  board: "cbse",
  medium: "english",
  className: "10",
  subject: "all",
};

models.facultyModel
  .create(user)
  .then((d) => console.log("done", d))
  .catch((e) => console.log("error", e));
