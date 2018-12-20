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
   * @return id -- unique string to be used as an id
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
  SIMPE ADDING METHODS
  **** */


  /* ****
  SIMPE GETTING METHODS
  **** */

  /**
   * @param table
   * @param column
   * @param value
   * @return promise, resolve returns array of datapacket(s) with requested info
   */
  baseGetVal(table, column, value) {
    return this.query(`SELECT * FROM ${table} WHERE ${column} = '${value}'`);
  }

  /**
   * @param table
   * @return promise, resolve returns array of datapacket(s) with requested info
   */
  baseGetAll(table) {
    return this.query(`SELECT * FROM ${table}`);
  }


  /* ****
  HIGH LEVEL SETTING METHODS
  **** */


  /* ****
  HIGH LEVEL GETTING METHODS
  **** */

  /**
   * @param firstEntityId
   * @param amount
   * @return Promise, with json of entities on resolve
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


    var sql = `SELECT entity.*, post.content, photo.photo FROM
      entity
      LEFT JOIN post ON post.entityId = entity.entityId
      LEFT JOIN photo ON photo.entityId = entity.entityId
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
   * Gets all data on specific entity
   * @param entityId
   * @param amountOfComments
   */
  getEntity(entityId, amountOfComments=20) {
    // INSIGHT: select specific columns, otherwise it'll replace from the joined table
    // aka, stop selecting *, making it specific
    var sql = [`SELECT entity.*, post.content, photo.photo FROM
      entity
      LEFT JOIN post ON post.entityId = entity.entityId
      LEFT JOIN photo ON photo.entityId = entity.entityId
      WHERE entity.entityId = '${entityId}' LIMIT 1`, // only one post after all
      `SELECT entity_tag.* FROM entity_tag
      WHERE entity_tag.entityId = '${entityId}'`,
      `SELECT COUNT(*) AS likes FROM entity_like
      WHERE entity_like.entityId = '${entityId}'`,
      `SELECT entity_comment.userId, entity_comment.content FROM entity_comment
      WHERE entity_comment.entityId = '${entityId}' LIMIT ${amountOfComments}`
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

        return this.query(`SELECT user.userId, user.username FROM user
          WHERE user.userId = '${users.join(`' OR user.userId = '`)}'`);
      })
      .then(rows => { // all the mentioned users
        var names = {};
        rows.forEach(user => { // basically, convert to JSON
          names[user.userId] = user.username;
        });

        hook.username = names[hook.userId]; // lookup userId in JSON and add it in
        hook.comments.forEach(cmmt => {
          cmmt.username = names[cmmt.userId];
        });

        return hook;
      });
  }

}
const db = new Database();

module.exports = db;
