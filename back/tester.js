const db = require("./db.js");


var postId = "89c6225d-362c-c6a0-e028-b6273a2b2c2f";
db.getRecentEntities()
  .then(result => {
    console.log(result);
  });




// Adding a post
// var hook = {};
// db.baseGetVal("user", "username", "mfigurski80")
//   .then(rows => {
//     hook.userId = rows[0].userId;
//     hook.entityId = db.GUID();
//     return Promise.all([
//       db.baseAddEntity(hook.entityId, hook.userId),
//       db.baseAddPost(hook.entityId, "Second post..."),
//       db.baseAddEntityTag(hook.entityId, "dev")
//     ]);
//   })
//   .then(values => {
//     console.log(values)
//   });
