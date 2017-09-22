const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

mongoose.connect("mongodb://localhost:auth/auth");

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));
app.use(passport.initialize());
router(app);

const port = process.env.port || 3080;
const server = http.createServer(app);

server.listen(port, function() {
  console.log("server is listen on :", port);
});
