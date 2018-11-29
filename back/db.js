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
          "CREATE TABLE user (userId VARCHAR(255) PRIMARY KEY, username TEXT, password TEXT, email TEXT, bio TEXT)",
          "CREATE TABLE user_subscription (userId VARCHAR(255), targetId VARCHAR(255))"
        ];
        sqlcmmds.forEach(cmmd => {
          this.query(cmmd)
            .catch(err => {console.log(err)});
        });
      });
  }

  /**
   * safely closes database. Honestly, shouldnt be used
   */
  close() {
      return new Promise((resolve, reject) => {
        this.connection.end(err=>{
          if (err) return reject(err);
          resolve();
        });
      });
  }

  /**
   * async function to execute SQL queries
   * @param sql code to execute
   * @return promise, with resolve getting rows
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
   * async function to add a user
   * @param userid -- the username used for identifying user
   * @param firstname
   * @param lastname
   * @param profilepicture -- link to where it's saved
   * @param password -- hashed only in browser, rehash
   * @param email
   */
  addUser(userid, firstname, lastname, profilepicture, password, email) {
    return this.query("INSERT INTO `users` (`userid`, `firstname`, `lastname`, `profilepicture`, `password`, `email`, `timejoined`, `followinguserids`, `followersuserids`, `postids`) VALUES " +
    "('" + userid + "', '" + firstname + "', '" + lastname + "', NULL, '" + password + "', '" + email + "', CURRENT_TIMESTAMP, NULL, NULL, NULL)");
  }

  /**
   * async function to add a post
   * @param postid
   * @param authorid
   * @param content
   */
  addPost(postid, authorid, content) {
    return this.query("INSERT INTO `posts` (`postid`, `authorid`, `content`, `timeposted`, `likesuserids`) VALUES " +
    "('" + postid + "', '" + authorid + "', '" + content + "', CURRENT_TIMESTAMP, NULL)");
  }
}

const db = new Database();

module.exports = db;
