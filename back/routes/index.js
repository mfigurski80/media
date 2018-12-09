const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

// log and clean request
router.use("*", function(req, res, next) {
  // console.log(req.cookies);
  next();
});


const router_posts = require("./posts.js");
router.use("/posts", router_posts); // give posts routes to posts router

const router_users = require("./users.js");
router.use("/users", router_users); // give users routes to users router

module.exports = router;
