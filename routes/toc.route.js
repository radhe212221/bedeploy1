const models = require("../models");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  models.tocModel
    .find({ status: true })
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});
router.get("/filters", async (req, res) => {
  let data = [];
  const { board, className, medium, subject, topic } = req.query;
  if (!board) {
    data = await models.tocModel.distinct("board").exec();
    return res.json({ data, error: null, status: true });
  }
  if (!medium) {
    data = await models.tocModel.find({ board }).distinct("medium").exec();
    return res.json({ data, error: null, status: true });
  }
  if (!className) {
    data = await models.tocModel
      .find({ board, medium })
      .distinct("className")
      .exec();
    return res.json({ data, error: null, status: true });
  }

  if (!subject) {
    data = await models.tocModel
      .find({ board, medium, className })
      .distinct("subject")
      .exec();
    return res.json({ data, error: null, status: true });
  }

  if (!topic) {
    data = await models.tocModel
      .find({ board, medium, className, subject })
      .distinct("topic")
      .exec();
    return res.json({ data, error: null, status: true });
  }
});
router.post("/", (req, res) => {
  models.tocModel
    .create(req.body)
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});
router.patch("/", (req, res) => {
  const { id, k, v } = req.body;
  models.tocModel
    .findByIdAndUpdate(id, { [k]: v })
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  models.tocModel
    .findByIdAndUpdate(id, { status: false })
    .then((d) => res.json({ status: true, data: d, error: null }))
    .catch((e) => res.json({ status: true, data: null, error: e }));
});

module.exports = router;
