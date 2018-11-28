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
    // check posts table
    this.query("SELECT * FROM posts LIMIT 0").catch(err => { // posts table doesn't exist?
      console.log("[setting up posts table]");
      this.query("CREATE TABLE `mediadb`.`posts` ( `postid` TEXT NOT NULL , `authorid` TEXT NOT NULL , `content` TEXT NULL , `timeposted` TIMESTAMP NOT NULL , `likesuserids` TEXT NULL ) ENGINE = InnoDB;")
      .catch(err => {
        throw err; // kay, guess theres an actual problem then
      });
    });
    // check users table
    this.query("SELECT * FROM users LIMIT 0").catch(err => { // users table doesnt exist?
      console.log("[setting up users table]");
      this.query("CREATE TABLE `mediadb`.`users` ( `userid` TEXT NOT NULL , `firstname` TEXT NULL DEFAULT NULL , `lastname` TEXT NULL DEFAULT NULL , `profilepicture` TEXT NULL DEFAULT NULL , `password` TEXT NOT NULL , `email` TEXT NOT NULL , `timejoined` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `followinguserids` TEXT NULL DEFAULT NULL , `followersuserids` TEXT NULL DEFAULT NULL , `postids` TEXT NULL DEFAULT NULL ) ENGINE = InnoDB;")
        .catch(err => {
          throw err;
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
