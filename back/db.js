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
          throw "[db structure is incorrect. fixing...]";
        }
      })
      .catch(err => { // if it doesn't... create all the tables
        console.log(err);
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
        sqlcmmds.forEach(cmmd => {
          this.query(cmmd)
            .catch(err => {console.log(err)});
        });
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


  /* ****
  SIMPE ADDING METHODS
  'base' because alter only specific table and doesn't check anything
  **** */

  /**
   * @param entityId
   * @param content
   * @return promise, with nothing passed as argument
   */
  baseAddPost(entityId, content) {
    return this.query(`INSERT INTO post (entityId, content) VALUES ` +
    `('${entityId}', '${content}')`);
  }

  /**
   * @param entityId
   * @param photo
   * @return promise, with nothing passed as argument
   */
  baseAddPhoto(entityId, photo) {
    return this.query(`INSERT INTO photo (entityId, photo) VALUES ` +
    `('${entityId}', '${photo}')`);
  }

  /**
   * @param entityId
   * @param userId
   * @return promise, with nothing passed as argument
   */
  baseAddEntity(entityId, userId) {
    return this.query(`INSERT INTO entity (entityId, timePosted, userId) VALUES ` +
    `('${entityId}', CURRENT_TIMESTAMP, '${userId}')`);
  }

  /**
   * @param entityId
   * @param tagName
   * @return promise, with nothing passed as argument
   */
  baseAddEntityTag(entityId, tagName) {
    return this.query(`INSERT INTO entity_tag (entityId, tagName) VALUES ` +
    `('${entityId}', '${tagName}')`);
  }

  /**
   * @param entityId
   * @param userId
   * @return promise, with nothing passed as argument
   */
  baseAddEntityLike(entityId, userId) {
    return this.query(`INSERT INTO entity_like (entityId, userId) VALUES ` +
    `('${entityId}', '${userId}')`);
  }

  /**
   * @param entityId
   * @param userId
   * @param content
   * @return promise, with nothing passed as argument
   */
  baseAddEntityComment(entityId, userId, content) {
    return this.query(`INSERT INTO entity_comment (entityId, userId, content) VALUES ` +
    `('${entityId}', '${userId}', '${content}')`);
  }

  /**
   * @param userId
   * @param username
   * @param userpass -- unhashed as of yet
   * @param email
   * @return promise, with nothing passed as argument
   */
  baseAddUser(userId, username, password, email) {
    return this.query(`INSERT INTO user (userid, username, password, email, bio) VALUES ` +
    `('${userId}', '${username}', '${password}', '${email}', NULL)`);
  }

  /**
   * @param userId
   * @param targetId
   * @return promise, with nothing passed as argument
   */
  baseAddUserSubscription(userId, targetId) {
    return this.query(`INSERT INTO user_subscription (userId, targetId) VALUES ` +
    `('${userId}', '${targetId}')`);
  }


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
   * @return idk yet,
   */
  getRecentPosts(firstEntityId=undefined, amount=10) {
    var conditional = ""
    if (firstEntityId) { // if there's a firstEntityId
      conditional = `WHERE timePosted < (SELECT timePosted FROM entity WHERE entityId = '${firstEntityId}')`;
    }
    var sql = `SELECT * FROM (SELECT * FROM entity ${conditional}) AS entity
      JOIN post ON post.entityId = entity.entityId
      UNION
      SELECT * FROM (SELECT * FROM entity ${conditional}) AS entity
      JOIN photo ON photo.entityId = entity.entityId
      ORDER BY timePosted DESC LIMIT ${amount};`;

    var hook = {} // saves info across requests
    this.query(sql)
      .then(rows => { // entityinfo + post/photo info
        // console.log(rows);
        hook.entities = rows;

        return Promise.all(hook.entities.map(entity => {
          return this.query(`SELECT * FROM entity_tag WHERE entityId = '${entity.entityId}'`)
        }));
      })
      .then(rows => { // lots of tag data
        rows.forEach(row => {
          if (row.length === 0) {
            null;
          } else {
            console.log(row[0].entityId);
          }
        });
        // console.log(rows)
      })

  }


}
const db = new Database();

module.exports = db;
