const express = require("Express");
const router = express.Router();

// log and clean request
router.use("*", function(req, res, next) {
  // console.log(req.cookies);
  next();
});

router.get("/posts", function(req, res, next) {
  res.json([
    {"title":"hello"},
    {"title":"world"}
  ]);
})

module.exports = router;
