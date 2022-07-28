const models = require("../models");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  models.materialModel
    .find({ status: true })
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});
router.get("/faculty/:id", (req, res) => {
  const fid = req.params.id;
  models.materialModel
    .find({ status: true, createdBy: fid })
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const faculty = await models.facultyModel.findById(id).catch((e) => null);
  const { board, medium, className, subject } = faculty;
  const { topic, title, comments, remarks, tags, createdBy, url, poster } =
    req.body;
  const newMaterial = {
    board,
    medium,
    className,
    subject,
    topic,
    title,
    comments,
    remarks,
    tags,
    createdBy,
    url,
    poster,
    createdBy: id,
  };
  models.materialModel
    .create(newMaterial)
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});
router.patch("/", (req, res) => {
  const { id, k, v } = req.body;
  models.materialModel
    .findByIdAndUpdate(id, { [k]: v })
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  models.materialModel
    .findByIdAndUpdate(id, { status: false })
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});

module.exports = router;
