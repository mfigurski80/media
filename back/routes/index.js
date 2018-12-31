const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");
// import the SessionManager Object
const SessionManager = require("../SessionManager.js");
sessionManager = new SessionManager(db);

// pass request and response through sessionManager
router.use("*", function(req, res, next) {
  req = sessionManager.manageRequest(req, res);
  next();
});


router.post("*", function(req, res, next) { // clean post requests
  const routesWithoutLogin = ["/users", "/login"];
  if (!(req.session.userId && req.body) && !routesWithoutLogin.some(route => {return route == req.originalUrl})) { // if not logged in or not posting

  } else {
    next();
  }
});
router.delete("*", function(req, res, next) { // clean delete requests
  if (!req.session.userId) {
    res.json({success: false, message: "You are not logged in"});
  } else {
    next();
  }
});


const router_posts = require("./posts.js");
router.use("/posts", router_posts); // give posts routes to posts router

const router_users = require("./users.js");
router.use("/users", router_users); // give users routes to users router



router.use("*", function(req, res, next) { // 404
  res.send("It seems like the page you're looking for doesn't exist. Sorry, we're still under development");
});

module.exports = router;
