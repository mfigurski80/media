const db = require("./db.js");

db.getUser("mfigurski80")
  .then(rows => {
    console.log(rows[0]);
  });

// console.log(db.GUID());
