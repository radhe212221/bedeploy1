require("dotenv").config();
const PREFIX = process.env.PREFIX || "RTS";
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/:type", (req, res) => {
  const { type } = req.params;
  const {
    page,
    event,
    key,
    value,
    actiondate,
    resourceid,
    resourcetype,
    component,
  } = req.headers;
  let toWrite = `${page},${event},${key},${value},${actiondate},${decodeURI(
    resourceid
  )},${resourcetype},${component},${Date.now()}\n`;
  const logDate = moment().format("YYYY-MM-DD");
  let filePath = "";
  if (type === "user") {
    let { user } = req.headers;
    const x = user.split(" ")[1] + ".csv";
    filePath = path.join(__dirname, "..", "events", type, x);
  }
  if (type === "guest") {
    const x = `${logDate}.csv`;
    filePath = path.join(__dirname, "..", "events", type, x);
  }
  fs.appendFileSync(filePath, toWrite, "utf-8");
  res.status(200).send("completed");
});

router.get("/logs/:type", (req, res) => {
  const { type } = req.params;
  if (type === "guest") {
    res.json({ status: true, data: [], error: null });
  }
  const folderPath = path.join(__dirname, "..", "events", "user");
  const data = fs.readdirSync(folderPath, "utf8");
  let a = [];
  data.forEach((file) => {
    a.push(fs.readFileSync(path.join(folderPath, file), "utf-8"));
  });
  Promise.all(a)
    .then((d) => d.map((x) => x.split("\n")).filter((x) => x))
    .then((d) => {
      let temp = [];
      d.forEach((x) => {
        temp = [...temp, ...x.filter((x) => x.trim())];
      });
      return temp;
    })
    .then((d) => {
      res.json({ status: true, data: d, error: null });
    })
    .catch((e) => {
      res.json({ status: false, data: null, error: e });
    });
});
module.exports = router;
