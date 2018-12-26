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
   * Performs the necessary cleaning operations after the standard sql get query
   * Basically just replaces splits the tags
   * @param entities
   * @return enties
   */
  __util__fixEntities(entities) {
    entities.forEach(entity => {
      entity.tags ? entity.tags = entity.tags.split(",") : entity.tags = [];
    });
    return entities;
  }

  /**
   * Gets most recent entities (globally)
   * @param props - firstEntityId, userId, tag
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

    return this.query(`SELECT entity.*,
        COUNT(DISTINCT entity_comment.content) AS comments,
        COUNT(DISTINCT entity_like.userId) AS likes,
        GROUP_CONCAT(DISTINCT entity_tag.tagName) AS tags,
        post.content,
        photo.photo,
        user.username
      FROM entity
      LEFT JOIN entity_comment ON entity_comment.entityId = entity.entityId
      LEFT JOIN entity_like ON entity_like.entityId = entity.entityId
      LEFT JOIN entity_tag ON entity_tag.entityId = entity.entityId
      LEFT JOIN post ON post.entityId = entity.entityId
      LEFT JOIN photo ON photo.entityId = entity.entityId
      LEFT JOIN user ON user.userId = entity.userId
      ${conditional}
      GROUP BY entity.entityId
      ORDER BY timePosted DESC
      LIMIT ${amount}`)
        .then(entities => { // fix tags and comments real quick
          return this.__util__fixEntities(entities);
        });
  }

  /**
   * gets posts from users that a given user subscribes to
   * @param props - userId, lastEntity
   * @param amount
   * @return json of entities
   */
  getSubscribedEntities(props={}, amount=10) {
    // props should have userId, may also have lastEntity (for getting more)
    var conditions = [`user_subscription.userId = '${props.userId}'`]
    props.lastEntity ? conditions.push(`entity.timePosted < (SELECT entity.timePosted FROM entity WHERE entity.entityId = '${props.lastEntity}')`) : null;

    var hook = {};
    return this.query(`SELECT entity.*,
        post.content,
        photo.photo,
        user.username,
        COUNT(DISTINCT entity_comment.content) AS comments,
        COUNT(DISTINCT entity_like.userId) AS likes,
        GROUP_CONCAT(DISTINCT entity_tag.tagName) AS tags
      FROM user_subscription
      JOIN entity ON entity.userId = user_subscription.targetId
      LEFT JOIN post ON post.entityId = entity.entityId
      LEFT JOIN photo ON photo.entityId = entity.entityId
      JOIN user ON user.userId = entity.userId
      LEFT JOIN entity_comment ON entity_comment.entityId = entity.entityId
      LEFT JOIN entity_like ON entity_like.entityId = entity.entityId
      LEFT JOIN entity_tag ON entity_tag.entityId = entity.entityId
      ${`WHERE ` + conditions.join(` AND `)}
      GROUP BY entity.entityId
      ORDER BY entity.timePosted DESC
      LIMIT ${amount}`)
        .then(entities => {
          return this.__util__fixEntities(entities);
        });
  }

  /**
   * gives back trending entities -- composite of amount of comments and amount of likes, limit to 2 weeks?
   * @param props - lastEntity //PROBLEMS
   * @param amount
   * @return json of entities
   */
  getTrendingEntities(props={}, amount=10) {
    // TODO: props can have the lastEntity, userId, and/or tag
    // TODO: in final version, change interval to like 14 days
    // TODO: figure out how to order by likes + comments
    var conditions = [`entity.timePosted >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`];
    if (props.lastEntity) {
      conditions.push(`(SELECT COUNT(DISTINCT entity_like.userId)) <= (SELECT COUNT(DISTINCT entity_like.userId)
        FROM entity_like WHERE entity.entityId = '${props.lastEntity}')`)
    } //TODO: select correct range. Notice that re-selecting old data will be inevitable as there is a lot of overlap

    console.log(conditions);

    return this.query(`SELECT entity.*,
      COUNT(DISTINCT entity_comment.content) AS comments,
      COUNT(DISTINCT entity_like.userId) AS likes,
      GROUP_CONCAT(DISTINCT entity_tag.tagName) AS tags,
      post.content,
      photo.photo,
      user.username
    FROM entity
    LEFT JOIN entity_comment ON entity_comment.entityId = entity.entityId
    LEFT JOIN entity_like ON entity_like.entityId = entity.entityId
    LEFT JOIN entity_tag ON entity_tag.entityId = entity.entityId
    LEFT JOIN post ON post.entityId = entity.entityId
    LEFT JOIN photo ON photo.entityId = entity.entityId
    LEFT JOIN user ON user.userId = entity.userId
    ${(conditions.length > 0) ? `WHERE ` + conditions.join(` AND `) : null}
    GROUP BY entity.entityId
    ORDER BY likes DESC, entity.timePosted DESC
    LIMIT ${amount}`)
      .then(entities => { // have all entities
        return this.__util__fixEntities(entities);
      });
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
      LEFT JOIN user ON user.userId = entity.userId
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


  /* ****
  ADDING METHODS
  **** */

  /**
   * Adds a post into the db
   * @param userId
   * @param content
   * @param tags
   */
  addPost(userId, content, tags=undefined) {
    const entityId = this.GUID();
    let sql = [
      `INSERT INTO entity (entityId, timePosted, userId)
        VALUES ('${entityId}', CURRENT_TIMESTAMP, '${userId}')`,
      `INSERT INTO post (entityId, content)
        VALUES ('${entityId}', ${this.connection.escape(content)})`
    ];
    tags.forEach(tag => {
      sql.push(`INSERT INTO entity_tag (entityId, tagName)
      VALUES ('${entityId}', ${this.connection.escape(tag)})`);
    });
    return Promise.all(sql.map(qur => {return this.query(qur)}));
  }

  /**
   * Adds a photo into the db
   * @param userId
   * @param photo
   * @param tags
   */
  addPhoto(userId, photo, tags=undefined) {
    const entityId = this.GUID();
    let sql = [`INSERT INTO entity (entityId, timePosted, userId)
      VALUES ('${entityId}', CURRENT_TIMESTAMP, '${userId}')`,
      `INSERT INTO photo (entityId, photo)
      VALUES ('${entityId}', '${photo}')`
    ];
    tags.forEach(tag => {
      sql.push(`INSERT INTO entity_tag (entityId, tagName)
      VALUES ('${entityId}', ${this.connection.escape(tag)})`);
    });
    return Promise.all(sql.map(qur => {return this.query(qur)}));
  }

  /**
   * Adds a like
   * @param entityId
   * @param userId
   */
  addLike(entityId, userId) {
    return this.query(`INSERT INTO entity_like (entityId, userId)
      VALUES ('${entityId}', ${userId})`);
  }

  /**
   * Adds a comment
   * @param entityId
   * @param entityId
   * @param content
   */
  addComment(entityId, userId, content) {
    return this.query(`INSERT INTO entity_comment (entityId, userId, content)
      VALUES ('${entityId}', '${userId}', ${this.connection.escape(content)})`);
  }

}
const db = new Database();

module.exports = db;
