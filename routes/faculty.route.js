const models = require("../models");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: true, data: [], error: null });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await models.facultyModel.findById(id).catch((e) => null);
  res.json({ status: true, data, error: null });
});


module.exports = router;
