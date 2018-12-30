// THIS IS A ROUTER FOR ALL PATHS BEGINNING WITH: "/post"
const express = require("Express");
const router = express.Router();

// import the database connection
const db = require("../db.js");

/**
 * resolves given response appropriately when promise resolved/catched
 * @param {Response Object} res     request response object
 * @param {Promise}         promise any promise object
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
      res.json(_successMessage(false, err));
    });
}



// GET

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
// curl -i --data "content=first remote post&tags=[dev]" http://localhost:3001/posts
router.post("*", function(req, res, next) { // clean post requests
  if (!(req.session.userId && req.body)) { // if not logged in or not posting
    res.end();
  }
  next();
});

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

router.post("/:entityId", function(req, res, next) { // add a comment
  __util__resolveOn(res, db.addComment(req.params.entityId, req.session.userId, req.body.content));
});

router.post("/:entityId/like", function(req, res, next) { // add a like
  __util__resolveOn(res, db.addLike(req.params.entityId, req.session.userId));
});

// DELETE
// curl -X DELETE http://localhost:3001/posts/89185a73-4d83-020d-b5cd-0bccb97a7237
router.delete("*", function(req, res, next) { // clean delete requests
  if (!req.session.userId) {
    res.end();
  }
  next();
});

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



module.exports = router;
