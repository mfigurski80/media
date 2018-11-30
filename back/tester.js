const db = require("./db.js");


var user = {}
db.getUser("mfigurski80")
  .then(rows => {
    console.log(rows[0]);
    user = rows[0];
  });
