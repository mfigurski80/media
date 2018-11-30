const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

// log and clean request
router.use("*", function(req, res, next) {
  // console.log(req.cookies);
  next();
});

router.get("/posts", function(req, res, next) {
  res.json([
    {"title":"hello"},
    {"title":"world"}
  ]);
})

router.get("/users", function(req, res, next){
  db.baseGetAll("user")
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
