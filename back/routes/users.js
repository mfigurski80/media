// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/users"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

/**
 * resolves given response appropriately when promise resolved/catched
 * @param {Response Object} res     request response object
 * @param {Promise} promise         any promise object
 */
function __util__resolveOn(res, promise) { // resolves request when promise resolves
  function _successMessage(isSuccessful = true, message = undefined) { // returns standard success message
    return {success: isSuccessful, message: message};
  }
  promise
    .then(rows => {
      res.json(_successMessage(true, "Operation was successful"));
    })
    .catch(err => {
      console.log(err);
      res.json(_successMessage(false, err.toString()));
    });
}



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
// curl -i -X POST --data ":data" http://localhost:3001/users
router.post("/", function(req, res, next) { // make a new user
  __util__resolveOn(res, db.addUser(req.body.username, req.body.password, req.body.email));
});

router.post("/:userId/subscriptions", function(req, res, next) { // subscribe to userId
  __util__resolveOn(res, db.addSubscription(req.session.userId, req.params.userId));
});

// DELETE
router.delete("/:userId", function(req, res, next) { // delete user
  __util__resolveOn(res, new Promise((resolve, reject)=>{
    if (req.params.userId == req.session.userId) {
      resolve(db.deleteUser(req.params.userId));
    } else {
      return reject("You are not the user you are deleting")
    }
  }));

});

router.delete("/:userId/subscriptions", function(req, res, next) { // delete subscription to userId
  __util__resolveOn(res, db.deleteSubscription(req.session.userId, req.params.userId));
});

module.exports = router;
