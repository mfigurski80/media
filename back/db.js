const mysql = require('mysql');

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      user: "social_app_user",
      host: "localhost",
      password: "react and express",
      database : "mediadb"
    });
  }

  test() {
    this.query("SELECT 1+1 AS solution")
      .then(rows => {
        console.log(rows);
      });
  }

  /**
   * async function to execute SQL queries
   * @param sql code to execute
   * @return promise, with resolve getting rows
   */
  query(sql) {
    return new Promise((resolve, reject) => {
      this.connection.connect();
      this.connection.query(sql, (err, rows) => { //when results come back...
        if (err) return reject(err);// throw all errors
        this.connection.end();      // end connection
        resolve(rows);              // resolve promise with rows
      });
    });
  }
}

const db = new Database();

module.exports = db;
