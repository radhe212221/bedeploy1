require("dotenv").config();
const PORT = process.env.PORT || 4000;
const app = require("express")();
const cors = require("cors");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const routes = require("./routes");
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());
app.get("/", (req, res) => {
  res.json({
    data: req.headers,
    msg: "welcome to server on " + PORT,
  });
});
app.use("/upload", routes.upload);
app.use("/uploads", routes.upload);
app.use("/toc", routes.toc);
app.use("/faculty", routes.faculty);
app.use("/material", routes.material);
app.use("/admin", routes.admin);
app.use("/user", routes.users);
app.use("/events", routes.events);
app.listen(PORT, () => console.log("syarted " + PORT));
