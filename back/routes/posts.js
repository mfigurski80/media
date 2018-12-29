// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/post"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

// GET

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

router.get("/trending", function(req, res, next) { // get most liked within 2 weeks
  db.getTrendingEntities({
    lastEntity: req.query.after,
    userId: req.query.user,
    tag: req.query.tag
  })
    .then(entities => {
      res.json(entities);
    })
    .catch(err => {
      res.send(err);
    })
});

router.get("/:entityId", function(req, res, next) { // get specific entity
  db.getEntity(req.params.entityId)
    .then(entity => {
      res.json(entity);
    })
    .catch(err => {
      res.send(err);
    });
});


// POST

router.post("/", function(req, res, next) {
  console.log(req.body);
  res.end();
});


module.exports = router;
