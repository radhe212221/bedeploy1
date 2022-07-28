const upload = require("./upload.route");
const toc = require("./toc.route");
const faculty = require("./faculty.route");
const material = require("./material.route");
const admin = require("./admin.route");
const users = require("./users.route");
const events = require("./events.route");
module.exports = {
  upload,
  toc,
  faculty,
  material,
  admin,
  users,
  events,
};
