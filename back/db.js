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


    var sql = `SELECT * FROM (SELECT * FROM entity ${conditional}) AS entity
      JOIN post ON post.entityId = entity.entityId
      UNION
      SELECT * FROM (SELECT * FROM entity ${conditional}) AS entity
      JOIN photo ON photo.entityId = entity.entityId
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

        rows[0].forEach(tag => {
          const i = hook.entitiesIndex.indexOf(tag.entityId);
          if (hook.entities[i].tags) { // if tags already exists...
            hook.entities[i].tags.push(tag.tagName);
          } else {
            hook.entities[i].tags = [tag.tagName];
          }
        });

        // TODO: get likes and comments as well
        return(hook.entities); // give back the entities!!!
      })
  }


}
const db = new Database();

module.exports = db;
