// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/post"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

router.get("/", function(req, res, next) { // get recent articles
  db.getRecentEntities(req.query.entityId)
    .then(entities => {
      res.json(entities);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
