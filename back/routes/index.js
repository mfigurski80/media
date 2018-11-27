const express = require("Express");
const router = express.Router();

router.get("/posts", function(req, res, next) {
  res.json([
    {"title":"hello"},
    {"title":"world"}
  ]);
})

module.exports = router;
