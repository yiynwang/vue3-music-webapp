const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const csrf = require("xsrf");
const registerRouter = require("./router");

const PORT = 9090;
const HOST = "0.0.0.0";

const app = express();

const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ["HEAD", "OPTIONS"],
  checkPathReg: /^\/api/,
});
app.use(cookieParser());
app.use(csrfProtection);

app.get("/", function (req, res, next) {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  return next();
});

registerRouter(app);

app.use(compression());

app.use(express.static("dist"));

app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") {
    return next();
  }

  // handle CSRF token errors here
  res.status(403);
  res.send("<p>接口已经被用 CSRF 保护了</p>");
});

module.exports = app.listen(PORT, HOST, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`接口服务器开启成功 - ${HOST}:${PORT}`);
});
