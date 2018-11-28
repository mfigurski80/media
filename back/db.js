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
    this.connection.connect();

    this.connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
      if (err) throw err;
      console.log("DB online?", rows[0].solution == 2);
      console.log(rows);
    });

    this.connection.end();
  }
}

const db = new Database();

module.exports = db;
