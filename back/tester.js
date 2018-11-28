const db = require("./db.js");

db.query("SELECT * FROM posts")
  .then(rows=>{
    console.log(rows)
  })
  .catch(err=>{
    throw err;
  });

db.test();
