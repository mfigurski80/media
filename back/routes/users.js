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

router.get("/:userId/subscriptions", function(req, res, next) {
  db.getSubscribedEntities({userId: req.params.userId, lastEntity: req.query.after})
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
