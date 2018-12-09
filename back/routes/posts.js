// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/post"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

router.use("/", function(req, res, next) {
  db.getRecentEntities(amount=10)
    .then(entities => {
      res.json(entities);
    })
    .catch(err => {
      res.send("The information you requested could not be retrieved");
    });
});

module.exports = router;
