const mysql = require('mysql');

class Database {
  constructor() {
    console.log("[initializing database connection]");
    // initialize connection
    this.connection = mysql.createConnection({
      user: "social_app_user",
      host: "localhost",
      password: "react and express",
      database : "mediadb"
    });
    this.connection.connect();

    /* make sure sql has all necessary tables */
    this.query("SHOW TABLES")
      .then(rows => {
        // console.log(rows);
        var reqTables = ["post", "photo", "entity", "entity_tag", "entity_like", "entity_comment", "user", "user_subscription"];
        if (rows) {
          rows.forEach(row => {
            const tbl = row.Tables_in_mediadb;
            reqTables.splice(reqTables.indexOf(tbl),1);
          });
        }
        if (reqTables.length !== 0) {
          throw "[db structure is missing tables...]";
        }
      })
      .catch(err => { // if it doesn't... create all the tables
        console.log(err);
        __resetDB__(); // reset the table structures.
      });
  }


  /* ****
  UTILITY METHODS
  **** */

  /**
   * async function to execute SQL queries
   * @param sql code to execute
   * @return promise, with resolve returning rows
   */
  query(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err, rows) => { //when results come back...
        if (err) return reject(err); // throw all errors
        resolve(rows);               // resolve original promise with rows
      });
    })
      .catch(err => {
        console.log(`[Couldn't perform operation:  ${err.sql}] \n[${err.sqlMessage}]`);
        // console.log(err);
        throw err;
      });
  }

  /**
   * method to generate random ids with minimal collisions
   * @return random id
   */
  GUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return "ss-s-s-s-sss".replace(/s/g, s4);
  }

  /**
   * WARNING: DO NOT EVER CALL THIS FUNCTION OUTSIDE OF THE DB CONSTRUCTOR.
   * IT WILL RESET THE DATABASE AND ITS STRUCTURE. BAD
   */
  __resetDB__() {
    console.log("\n\n[NOTICE: resetting table structure]\n\n");
    const sqlcmmds = [
      "CREATE TABLE post (entityId VARCHAR(255) PRIMARY KEY, content TEXT)",
      "CREATE TABLE photo (entityId VARCHAR(255) PRIMARY KEY, photo TEXT)",
      "CREATE TABLE entity (entityId VARCHAR(255) PRIMARY KEY, timePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP, userId VARCHAR(255))",
      "CREATE TABLE entity_tag (entityId VARCHAR(255), tagName TEXT)",
      "CREATE TABLE entity_like (entityId VARCHAR(255), userId VARCHAR(255))",
      "CREATE TABLE entity_comment (entityId VARCHAR(255), userId VARCHAR(255), content TEXT)",
      "CREATE TABLE user (userId VARCHAR(255) PRIMARY KEY, username VARCHAR(255) UNIQUE, password TEXT, email TEXT, bio TEXT)",
      "CREATE TABLE user_subscription (userId VARCHAR(255), targetId VARCHAR(255))"
    ];
    return Promise.all(sqlcmmds.map(cmmd => {
      return this.query(cmmd);
    }))
      .then(rows => {
        console.log("[NOTICE: database cleared and formatted]");
        return rows;
      })
      .catch(err => {
        console.log("[NOTICE: could not clear and format database]");
        throw err;
      });
  }




  /* ****
  GETTING METHODS
  **** */

  /**
   * @param firstEntityId
   * @param amount
   * @return json of entities
   */
  getRecentEntities(props={}, amount=10) {
    var conditions = []; // get all the props (search parameters), and develop sql conditions
    if (props.firstEntityId) { // if there's a firstEntityId
      conditions.push(`timePosted < (SELECT timePosted FROM entity WHERE entityId = '${props.firstEntityId}')`);
    }
    if (props.userId) { // if there's a userId
      conditions.push(`userId = '${props.userId}'`);
    }
    if (props.tag) { // if there's a tag
      conditions.push(`EXISTS (SELECT * FROM entity_tag WHERE entityId = entity.entityId AND tagName = '${props.tag}')`);
      // I'm really surprised that worked ^. Fucking magic.
    }

    var conditional = "";
    if (conditions.length > 0) { // form conditional from array
      conditional = "WHERE " + conditions.join(" AND ");
    }


    var sql = `SELECT entity.*, post.content, photo.photo, user.username FROM
      entity
      LEFT JOIN post ON post.entityId = entity.entityId
      LEFT JOIN photo ON photo.entityId = entity.entityId
      JOIN user ON user.userId = entity.userId
      ${conditional}
      ORDER BY timePosted DESC LIMIT ${amount};`;

    var hook = {} // saves info across requests
    return this.query(sql)
      .then(rows => { // entityinfo + post/photo info
        hook.entities = rows;
        hook.entitiesIndex = hook.entities.map(entity => {
          return entity.entityId;
        });
        var conditional = ""; // create another conditional statement
        if (hook.entitiesIndex.length > 0) {
          conditional = " WHERE entityId = '" + hook.entitiesIndex.join("' OR entityId = '") + "'";
        }
        return Promise.all([ // get tags, amoung of likes and amount of comments
          this.query(`SELECT * FROM entity_tag ${conditional}`),
          this.query(`SELECT * FROM entity_like ${conditional}`), // TODO: get these without requesting ALL the info
          this.query(`SELECT * FROM entity_comment ${conditional}`)
        ]);
      })
      .then(rows => { // lots of tag, like, comment data
        // rows[0] == tags
        // rows[1] == likes
        // rows[2] == comments

        rows[0].forEach(tag => { // tags
          const i = hook.entitiesIndex.indexOf(tag.entityId);
          if (hook.entities[i].tags) { // if tags exists...
            hook.entities[i].tags.push(tag.tagName);
          } else {
            hook.entities[i].tags = [tag.tagName];
          }
        });
        rows[1].forEach(like => { // likes
          const i = hook.entitiesIndex.indexOf(like.entityId);
          if (hook.entities[i].likes) { // if likes exist...
            hook.entities[i].likes += 1;
          } else {
            hook.entities[i].likes = 1;
          }
        });
        rows[2].forEach(cmmnt => { // comments
          const i = hook.entitiesIndex.indexOf(cmmnt.entityId);
          if (hook.entities[i].comments) { // if comments exist...
            hook.entities[i].comments += 1
          } else {
            hook.entities[i].comments = 1;
          }
        });

        return(hook.entities); // give back the entities!!!
      })
  }

  /**
   * @param userId
   * @param amount
   * @return json of entities
   */
  getSubscribedEntities(params, amount=10) { // TODO: get posts after...
    // params should have userId, may also have lastEntity (for getting more)
    var hook = {};
    return this.query(`SELECT user_subscription.targetId FROM
      user_subscription
      WHERE user_subscription.userId = '${params.userId}'`)
      .then(rows=> { // get all users subscribed to
        const conditions = rows.map(row => {
          return `entity.userId = '${row.targetId}'`;
        });

        var conditional = `WHERE ${conditions.join(` OR `)}`; // form conditional to grab posts by users
        if (params.lastEntity) {                              // and after certain entity, if lastEntity provided
          conditional += ` AND entity.timePosted < (SELECT entity.timePosted FROM entity WHERE entity.entityId = '${params.lastEntity}')`;
        }

        return this.query(`SELECT entity.*, post.content, photo.photo, user.username FROM
          entity
          LEFT JOIN post ON post.entityId = entity.entityId
          LEFT JOIN photo ON photo.entityId = entity.entityId
          JOIN user ON user.userId = entity.userId
          ${conditional}
          ORDER BY entity.timePosted DESC LIMIT ${amount}`);
      })
      .then(rows => { // get all entities by those users (limit to ${amount})
        hook.entityIds = rows.map(row => {return row.entityId});
        hook.returnable = rows;
        return Promise.all([
          `SELECT entity_tag.* FROM entity_tag
            WHERE entity_tag.entityId = '${hook.entityIds.join(`' OR entity_tag.entityId = '`)}'`,
          `SELECT entity_like.entityId FROM entity_like
            WHERE entity_like.entityId = '${hook.entityIds.join(`' OR entity_like.entityId = '`)}'`,
          `SELECT entity_comment.entityId FROM entity_comment
            WHERE entity_comment.entityId = '${hook.entityIds.join(`' OR entity_comment.entityId = '`)}'`
        ].map(sql => {return this.query(sql)}));
      })
      .then(rows => { // get tags/likes/comments of these entities
        // rows[0] = tags
        // rows[1] = likes
        // rows[2] = comments

        rows[0].forEach(tag => { // for each tag
          var entity_ref = hook.returnable[hook.entityIds.indexOf(tag.entityId)];
          if (entity_ref.tags) {
            entity_ref.tags.push(tag.tagName);
          } else {
            entity_ref.tags = [tag.tagName];
          }
        });
        rows[1].forEach(like => { // for each like
          var entity_ref = hook.returnable[hook.entityIds.indexOf(like.entityId)];
          if (entity_ref.likes) {
            entity_ref.likes += 1;
          } else {
            entity_ref.likes = 1;
          }
        });
        rows[2].forEach(comment => {
          var entity_ref = hook.returnable[hook.entityIds.indexOf(comment.entityId)];
          if (entity_ref.comments) {
            entity_ref.comments += 1;
          } else {
            entity_ref.comments = 1;
          }
        });

        return hook.returnable;
      })
  }

  /**
   * Gets all data on specific entity
   * @param entityId
   * @param amountOfComments'
   * @return json entity
   */
  getEntity(entityId) {
    // INSIGHT: select specific columns, otherwise it'll replace from the joined table
    // aka, stop selecting *, making it specific
    var sql = [`SELECT entity.*, post.content, photo.photo, user.username FROM
      entity
      LEFT JOIN post ON post.entityId = entity.entityId
      LEFT JOIN photo ON photo.entityId = entity.entityId
      JOIN user ON user.userId = entity.userId
      WHERE entity.entityId = '${entityId}' LIMIT 1`, // only one post after all
      `SELECT entity_tag.* FROM entity_tag
      WHERE entity_tag.entityId = '${entityId}'`,
      `SELECT COUNT(*) AS likes FROM entity_like
      WHERE entity_like.entityId = '${entityId}'`,
      `SELECT entity_comment.userId, entity_comment.content, user.username FROM
      entity_comment
      JOIN user ON user.userId = entity_comment.userId
      WHERE entity_comment.entityId = '${entityId}'`
    ];

    var hook = {};
    return Promise.all(sql.map(sql_code => {
      return this.query(sql_code);
    }))
      .then(rows => {
        // rows[0] = entity + post/photo
        // rows[1] = tags
        // rows[2] = likes
        // rows[3] = comments

        hook = rows[0][0];
        hook.tags = rows[1].map(tag => {
          return tag.tagName;
        });
        hook.likes = rows[2][0].likes;
        hook.comments = rows[3];

        var users = [hook.userId]; //make array of all the userId's we'd like the name of
        users.push(hook.comments.map(comment => {
          return comment.userId;
        }));

        return hook;
      });
  }

  /**
   * Get all (public) data on specific user
   * @param userId
   * @return json user
   */
  getUser(userId) {
    return Promise.all([
      `SELECT user.userId, user.username, user.bio FROM user
        WHERE userId = '${userId}' LIMIT 1`,
      `SELECT entity_like.entityId FROM entity_like
        WHERE userId = '${userId}'`,
      `SELECT entity_comment.entityId, entity_comment.content FROM entity_comment
        WHERE userId = '${userId}'`,
      `SELECT user_subscription.targetId, user.username FROM
        user_subscription
        LEFT JOIN user ON user.userId = user_subscription.targetId
        WHERE user_subscription.userId = '${userId}'`,
      `SELECT COUNT(user_subscription.userId) AS subscribers FROM user_subscription
        WHERE user_subscription.targetId = '${userId}'`
    ].map(sql => {return db.query(sql)}))
      .then(rows => {
        // rows[0] = user data
        // rows[1] = likes
        // rows[2] = comments
        // rows[3] = subscriptions
        // rows[4] = subscribers

        var ret = rows[0][0]; // note, these are references here
        ret.likes = rows[1].map(like => {
          return like.entityId;
        });
        ret.comments = rows[2];
        ret.subscriptions = rows[3];
        ret.subscribers = rows[4][0].subscribers;
        return ret;
      });
  }

}
const db = new Database();

module.exports = db;
