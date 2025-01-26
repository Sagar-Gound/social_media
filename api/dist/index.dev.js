"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _helmet = _interopRequireDefault(require("helmet"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _index = require("./routes/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import Routes
var PORT = process.env.PORT || 4000;

_dotenv["default"].config();

_mongoose["default"].connect(process.env.MONGO_URL).then(function () {
  console.log("Connected to MongoDB");
});

var app = (0, _express["default"])(); // middlewares

app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _helmet["default"])());
app.use((0, _morgan["default"])("common")); // register Routes

app.use("/api/auth", _index.authRoute);
app.use("/api/users", _index.userRoute);
app.use("/api/posts", _index.postRoute);
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});