require("dotenv").config();
const DB = process.env.DB || "mongodb://localhost:27017/byju";
const mongoose = require("mongoose");
mongoose.connect(DB, () => {
  console.log("DB connected");
});
const otpModel = new mongoose.model(
  "otpModel",
  new mongoose.Schema({
    purpose: String,
    token: String,
    uid: String,
    phone: String,
    otp: String,
    start: { type: String, default: "" },
    end: { type: String, default: "" },
  })
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  board: { type: String, required: true },
  medium: { type: String, required: true },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  packages: [String],
  accessToken: String,
  refreshToken: String,
  salt: String,
  createdAt: { type: Date, default: Date.now },
  devices: [String],
  ipAddress: [String],
});

const userModel = new mongoose.model("user", userSchema);

const watchListSchema = new mongoose.Schema({
  uid: String,
  url: String,
  package: String,
  watched: { type: Boolean, default: false },
  started: { type: String, default: "0" },
  ends: { type: String, default: "0" },
  canWatch: { type: Boolean, default: false },
  watchedOn: { type: Date, default: Date.now },
});
const watchListModel = new mongoose.model("watchlist", watchListSchema);

const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  board: String,
  medium: String,
  className: String,
  subject: String,
  topic: { type: String, default: "" },
  tags: { type: String, default: "" },
  nickname: { type: String, default: "faculty" },
  image: { type: String, default: "" },
  url: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now(), immutable: true },
  status: { type: Boolean, default: true },
});
const facultyModel = new mongoose.model("faculty", facultySchema);

const uploadSchema = new mongoose.Schema({
  url: String,
  size: String,
  createdAt: { type: Date, default: Date.now(), immutable: true },
  status: { type: Boolean, default: true },
});
const uploadModel = new mongoose.model("upload", uploadSchema);

const tocSchema = new mongoose.Schema({
  board: String,
  medium: String,
  className: String,
  subject: String,
  topic: String,
  url: { type: String, default: "" },
  poster: { type: String, default: "" },
  preview: { type: String, default: "" },
  author: { type: String, default: "admin" },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now(), immutable: true },
  modifiedBy: { type: String, default: "admin" },
  modifiedOn: { type: Date, default: Date.now },
});
const tocModel = new mongoose.model("toc", tocSchema);

const materialSchema = new mongoose.Schema({
  board: String,
  medium: String,
  className: String,
  subject: String,
  topic: String,
  title: String,
  comments: String,
  remarks: String,
  tags: String,
  createdBy: { type: String, default: "" },
  url: { type: String, default: "" },
  poster: { type: String, default: "" },
  preview: { type: String, default: "" },
  author: { type: String, default: "faculty" },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now(), immutable: true },
});
const materialModel = new mongoose.model("material", tocSchema);

module.exports = {
  uploadSchema,
  uploadModel,
  tocSchema,
  tocModel,
  facultySchema,
  facultyModel,
  materialSchema,
  materialModel,

  userSchema,
  userModel,
  otpModel,
};
