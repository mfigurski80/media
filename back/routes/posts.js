// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/post"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

router.get("/", function(req, res, next) { // get recent articles
  db.getRecentEntities({
    firstEntityId: req.query.after, // if any get parameters exist, add em in
    userId: req.query.user,
    tag: req.query.tag
  })
    .then(entities => {
      res.json(entities);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
