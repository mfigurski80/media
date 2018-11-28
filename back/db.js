const mysql = require('mysql');

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      user: "social_app_user",
      host: "localhost",
      password: "react and express",
      database : "mediadb"
    });
    this.connection.connect();
  }

  /**
   * Demonstration of how to use this.query correctly. Also, tests db connect
   */
  test() {
    this.query("SELECT 1+1 AS solution")
      .then(rows => {
        console.log(rows);
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * safely closes database
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
        if (err) return reject(err);// throw all errors
        resolve(rows);            // resolve original promise with rows
      });
    });
  }
}

const db = new Database();

module.exports = db;
