const models = require("../models");
const express = require("express");
const router = express.Router();
router.get("/faculty", (req, res) => {
  models.facultyModel
    .find()
    .then((d) => {
      res.json({ data: d, status: true, error: null });
    })
    .catch((e) => {
      res.json({ data: null, status: false, error: e });
    });
});
router.get("/material", (req, res) => {
  models.materialModel
    .find()
    .then((d) => {
      res.json({ data: d, status: true, error: null });
    })
    .catch((e) => {
      res.json({ data: null, status: false, error: e });
    });
});
router.get("/upload", (req, res) => {
  models.uploadModel
    .find()
    .then((d) => {
      res.json({ data: d, status: true, error: null });
    })
    .catch((e) => {
      res.json({ data: null, status: false, error: e });
    });
});
router.get("/toc", (req, res) => {
  models.tocModel
    .find()
    .then((d) => {
      res.json({ data: d, status: true, error: null });
    })
    .catch((e) => {
      res.json({ data: null, status: false, error: e });
    });
});

module.exports = router;
