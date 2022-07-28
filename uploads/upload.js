const models = require("../models");
const fs = require("fs");
const file = fs.readFileSync("./excel.csv", "utf8");

const a = file
  .trim()
  .split("\n")
  .map((x) => x.split(","))
  .slice(1)
  .map((x) => ({
    board: x[0],
    medium: x[1],
    className: x[2],
    subject: x[3],
    topic: x[4],
  }));

models.tocModel
  .insertMany(a)
  .then((d) => console.log("done", d.length))
  .catch((e) => console.log("error", e));
