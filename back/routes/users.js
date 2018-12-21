// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/users"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");


router.use("/", function(req, res, next) {
  next();
});

// get all (public) user information
router.get("/:userId", function(req, res, next) {
  db.getUser(req.params.userId)
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.send(err);
    })
});

module.exports = router;
