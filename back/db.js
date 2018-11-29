const mysql = require('mysql');

class Database {
  constructor() {
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
        rows.forEach(row => {
          const tbl = row.Tables_in_mediadb;
          reqTables.splice(reqTables.indexOf(tbl),1);
        });
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
   * @param username
   * @param userpass -- unhashed as of yet
   * @param email
   */
  addUser(username, password, email) {
    return this.query("INSERT INTO user (userid, username, password, email, bio) VALUES " +
    "('" + this.GUID() + "', '" + username + "', '" + password + "', '" + email + "', NULL)")
  }

  /**
   * @param username
   * @return promise, resolve returns array of datapackets with user info
   */
  getUser(username) {
    return this.query("SELECT * FROM user WHERE username = '" + username + "'");
  }

  /**
   * @param userId
   * @return promise, resolve returns array of datapackets with user info
   */
  getUserById(userId) {
    return this.query("SELECT * FROM user WHERE userId = '" + userId + "'");
  }
}

const db = new Database();

module.exports = db;
