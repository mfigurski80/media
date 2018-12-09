// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/users"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");


router.use("/", function(req, res, next) {
  next();
});


module.exports = router;
