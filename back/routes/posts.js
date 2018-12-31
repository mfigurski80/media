// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/post"
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
// curl -i -X GET http://localhost:3001/posts
router.get("/", function(req, res, next) { // get recent articles
  db.getRecentEntities({
    firstEntityId: req.query.after, // if any get parameters exist, add em in
    userId: req.query.user,
    tag: req.query.tag
  })
    .then(entities => {
      res.json(entities);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/trending", function(req, res, next) { // get most liked within 2 weeks
  db.getTrendingEntities({
    lastEntity: req.query.after,
    userId: req.query.user,
    tag: req.query.tag
  })
    .then(entities => {
      res.json(entities);
    })
    .catch(err => {
      res.send(err);
    })
});

router.get("/:entityId", function(req, res, next) { // get specific entity
  db.getEntity(req.params.entityId)
    .then(entity => {
      res.json(entity);
    })
    .catch(err => {
      res.send(err);
    });
});


// POST
// curl -i -X POST --data "content=first remote post&tags=[dev]" http://localhost:3001/posts
router.post("/", function(req, res, next) { // add a photo/post
  var tags = req.body.tags ? req.body.tags.substr(1).slice(0,-1).split(",") : [];
  if (req.body.content) { // if posting text post
    __util__resolveOn(res, db.addPost(req.session.userId, req.body.content, tags));
  } else if (req.body.photo) { // if posting photo
    // TODO: figure this out
    res.end();
  } else { // if fucking around
    res.end();
  }
});

router.post("/:entityId/comment", function(req, res, next) { // add a comment
  __util__resolveOn(res, db.addComment(req.params.entityId, req.session.userId, req.body.content));
});

router.post("/:entityId/like", function(req, res, next) { // add a like
  __util__resolveOn(res,
    db.query(`SELECT userId FROM entity_like WHERE entityId = '${req.params.entityId}'`) // get all likes first...
      .then(rows => {
        if (!rows.some(row => { // if any of them bear session's userId, can't like again
          return row.userId == req.session.userId;
        })) {
          db.addLike(req.params.entityId, req.session.userId)
        } else {
          throw new Error("You have liked this already");
        }
      })
  );
});

// DELETE
// curl -i -X DELETE http://localhost:3001/posts/89185a73-4d83-020d-b5cd-0bccb97a7237
router.delete("/:entityId", function(req, res, next) { // delete entity
  __util__resolveOn(res,
    db.query(`SELECT entity.userId FROM entity WHERE entity.entityId = '${req.params.entityId}'`)
      .then(rows => {
        if (rows[0].userId === req.session.userId) { // if person is entity's author...
          return db.deleteEntity(req.params.entityId);
        } else {                                     // if person is not entity's author...
          throw new Error("You are not the author of this entity");
        }
      })
  );
});

router.delete("/:entityId/comment", function(req, res, next) { // delete comment
  // TODO: Wait, should this delete all comments? Nooo... get commentId implemented first.
})

router.delete("/:entityId/like", function(req, res, next) { // delete like
  __util__resolveOn(res, db.deleteLike(req.params.entityId, req.session.userId));
  // ^ don't care if it doesn't exist... db will handle that
});



module.exports = router;
