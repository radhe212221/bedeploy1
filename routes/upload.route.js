require("dotenv").config();
const PORT = process.env.PORT || 4000;
const models = require("../models");
const { uploadModel } = models;
const path = require("path");
const express = require("express");
const fs = require("fs");
const router = express.Router();

function streamIt(req, res, filePath) {
  const range = req.headers.range;
  if (!req.query.token) {
    res.status(400).send("kindly login to view this video");
  }
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoPath = filePath;
  const videoSize = fs.statSync(filePath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(res);
}

router.get("/", (req, res) => {
  res.json({ status: true, data: [], error: null });
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const readPath = path.join(__dirname, "..", "uploads", id);
  if (id.endsWith(".mp4")) {
    streamIt(req, res, readPath);
  } else {
    res.sendFile(readPath);
  }
});

router.post("/", (req, res) => {
  let file = req.files.file;
  let name = file.md5 + file.name;
  let size = file.size;
  const uploadPath = path.join(__dirname, "..", "uploads", name);
  const url = `http://localhost:${PORT}/uploads/${name}`;
  file.mv(uploadPath, (e, d) => {
    if (e) return res.json({ status: false, data: null, error: e });
    uploadModel
      .create({ url, name, size })
      .then((d) => res.json({ status: true, data: d, error: null }))
      .catch((e) => res.json({ status: false, data: null, error: e }));
  });
});

module.exports = router;
