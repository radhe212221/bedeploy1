const otpGenerator = require("otp-generator");
const moment = require("moment");
const models = require("../models");
const express = require("express");
const router = express.Router();
const { sign, verify } = require("../token");
router.post("/verify", async (req, res) => {
  const { otp, phone, purpose, token, uid } = req.body;
  const data = await models.otpModel
    .findOne({
      otp,
      phone,
      token,
      uid,
      end: "",
    })
    .then((d) => d._doc)
    .catch((e) => null);
  const a = moment(Date.now()).format("YYYY-MM-DD-HH-mm-SS").split("-");
  const b = moment(+data?.start)
    .format("YYYY-MM-DD-HH-mm-SS")
    .split("-");
  const diff = a.map((x, i) => +a[i] - +b[i]);
  console.clear();
  console.log(diff);
  if (
    diff[0] === 0 &&
    diff[1] === 0 &&
    diff[2] === 0 &&
    diff[3] === 0 &&
    diff[4] === 0 &&
    diff[5] >= 0 &&
    diff[5] <= 30
  ) {
    const d2 = await models.otpModel
      .findById(data?._id)
      .then((d) => {
        d.end = Date.now();
        return d.save();
      })
      .then((d) => d._doc)
      .catch((e) => null);
    res.json({ status: true, data, error: null });
  } else {
    res.json({ status: false, data: null, error: "timeout" });
  }
});
router.post("/login", async (req, res) => {
  const { token, uid, phone, purpose } = req.body;
  const data = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
  await models.otpModel.create({
    purpose,
    token,
    uid,
    phone,
    otp: data,
    start: Date.now(),
  });
  res.json({
    status: true,
    data,
    error: null,
  });
});
router.post("/signup", (req, res) => {});
router.post("/signup/1", async (req, res) => {
  const { name, email, phone } = req.body;
  let body = {
    name,
    email,
    phone,
    board: " ",
    medium: " ",
    className: " ",
    subject: " ",
  };
  let newUser = await models.userModel
    .create(body)
    .then((d) => d._doc)
    .catch((e) => null);
  const accessToken = await sign("accessToken", newUser);
  const refreshToken = await sign("refreshToken", newUser);
  const salt = await sign("salt", newUser);
  newUser = await models.userModel
    .findById(newUser._id)
    .then((d) => {
      d.accessToken = accessToken;
      d.refreshToken = refreshToken;
      d.salt = salt;
      d.save();
      return d._doc;
    })
    .catch((e) => null);

  res.json({
    status: !!newUser,
    data: newUser,
    error: null,
  });
});
router.post("/signup/2", async (req, res) => {
  const { uid } = req.body;
  let body = req.body;
  const userData = await models.userModel
    .findById(uid)
    .then((d) => {
      for (let k in body) {
        if (k !== "uid") {
          d[k] = body[k];
        }
      }
      return d.save();
    })
    .catch((e) => null);
  console.log(userData);
  res.json({ status: true, data: userData, error: null });
});
router.post("/signup/3", (req, res) => {
  res.json({ status: true, data: "signup/3", error: null });
});
router.post("/signup/4", (req, res) => {
  res.json({ status: true, data: "signup/4", error: null });
});

router.get("/faculty", (req, res) => {
  models.facultyModel
    .find({}, "name email className subject nickname createdAt status image")
    .then((d) => {
      res.json({ data: d, status: true, error: null });
    })
    .catch((e) => {
      res.json({ data: null, status: false, error: e });
    });
});
router.get("/material", (req, res) => {
  models.materialModel
    .find({}, "name email className subject nickname createdAt status image")
    .then((d) => {
      res.json({ data: d, status: true, error: null });
    })
    .catch((e) => {
      res.json({ data: null, status: false, error: e });
    });
});
router.get("/subject", async (req, res) => {
  const _token = req.headers.authorization.split(" ")[1];
  const { id } = await verify(_token);
  const cols =
    " board medium className subject topic title comments remarks tags createdBy url poster preview author status createdAt";
  const { board, className, medium, subject } = await models.userModel
    .findById(id)
    .then((d) => d._doc)
    .catch((e) => null);

  models.materialModel
    .find({ board, className }, cols)
    .then((d) => {
      res.json({ data: d, status: true, error: null });
    })
    .catch((e) => {
      res.json({ data: null, status: false, error: e });
    });
});
router.get("/videos", async (req, res) => {
  const { subject: subjectSelected } = req.query;
  // console.clear()

  const _token = req.headers.authorization.split(" ")[1];
  const { id } = await verify(_token);
  const cols = ` subject topic url poster`;
  const { board, className, medium, subject } = await models.userModel
    .findById(id)
    .then((d) => d._doc)
    .catch((e) => null);
  if (subjectSelected) {
    models.tocModel
      .find({ board, subject: subjectSelected, className, status: true }, cols)
      .then((d) => {
        res.json({ data: d, status: true, error: null });
      })
      .catch((e) => {
        res.json({ data: null, status: false, error: e });
      });
  } else {
    models.tocModel
      .find({ board, className, status: true }, cols)
      .then((d) => {
        res.json({ data: d, status: true, error: null });
      })
      .catch((e) => {
        res.json({ data: null, status: false, error: e });
      });
  }
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
router.get("/my-subjects", async (req, res) => {
  const _token = req.headers.authorization.split(" ")[1];
  const { id } = await verify(_token);
  const { board, className, medium, subject } = await models.userModel
    .findById(id)
    .then((d) => d._doc)
    .catch((e) => null);

  models.tocModel.find({ board, className }).distinct("subject", (e, d) => {
    if (e) {
      return res.json({ data: null, status: false, error: e });
    }
    return res.json({ data: d, status: true, error: null });
  });
});

router.get("/", (req, res) => {
  models.facultyModel
    .find()
    .then((d) => res.json({ data: d, status: true, error: null }))
    .catch((e) => res.json({ data: null, status: false, error: e }));
});

module.exports = router;
