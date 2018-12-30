// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/users"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");


// GET

router.get("/:userId", function(req, res, next) { // get all (public) user information
  db.getUser(req.params.userId)
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.send(err);
    })
});

router.get("/:userId/subscriptions", function(req, res, next) { // get posts by subscription
  db.getSubscribedEntities({userId: req.params.userId, lastEntity: req.query.after})
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.send(err);
    });
});

// POST

router.post("/", function(req, res, next) { // make a new user

});

router.post("/:userId/subscriptions", function(req, res, next) { // subscribe to userId

});

module.exports = router;
