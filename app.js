require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var chatsRouter = require("./routes/chats");
var searchRouter = require("./routes/search");
var app = express();

require("./models/connection");

const cors = require('cors');
// const fileUpload = require('express-fileupload');

// app.use(fileUpload())
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/chats", chatsRouter);
app.use("/search", searchRouter);

module.exports = app;
