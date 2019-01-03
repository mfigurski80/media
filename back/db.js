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
        var reqTables = ["request","post", "photo", "entity", "entity_tag", "entity_like", "entity_comment", "user", "user_subscription"];
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
        console.log(`\x1b[41m\t[DB] Couldn't perform operation: ${err.sql}\x1b[40m \n\t[DB] ${err.sqlMessage}`);
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
   * Hashing function of type SHA256
   * @param {Object} r Object to hash. Preferrably String, but maybe numbers as well?
   */
  SHA256(r){
    function k(r,n){var t=(65535&r)+(65535&n);return(r>>16)+(n>>16)+(t>>16)<<16|65535&t}function q(r,n){return r>>>n|r<<32-n}function s(r,n){return r>>>n}return function(r){for(var n="0123456789abcdef",t="",e=0;e<4*r.length;e++)t+=n.charAt(r[e>>2]>>8*(3-e%4)+4&15)+n.charAt(r[e>>2]>>8*(3-e%4)&15);return t}(function(r,n){var t,e,o,a,f,u,c,h,i,C,g,A,d,v,l,S,m,y,w=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),b=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225),p=new Array(64);r[n>>5]|=128<<24-n%32,r[15+(n+64>>9<<4)]=n;for(var H=0;H<r.length;H+=16){t=b[0],e=b[1],o=b[2],a=b[3],f=b[4],u=b[5],c=b[6],h=b[7];for(var j=0;j<64;j++)p[j]=j<16?r[j+H]:k(k(k(q(y=p[j-2],17)^q(y,19)^s(y,10),p[j-7]),q(m=p[j-15],7)^q(m,18)^s(m,3)),p[j-16]),i=k(k(k(k(h,q(S=f,6)^q(S,11)^q(S,25)),(l=f)&u^~l&c),w[j]),p[j]),C=k(q(v=t,2)^q(v,13)^q(v,22),(g=t)&(A=e)^g&(d=o)^A&d),h=c,c=u,u=f,f=k(a,i),a=o,o=e,e=t,t=k(i,C);b[0]=k(t,b[0]),b[1]=k(e,b[1]),b[2]=k(o,b[2]),b[3]=k(a,b[3]),b[4]=k(f,b[4]),b[5]=k(u,b[5]),b[6]=k(c,b[6]),b[7]=k(h,b[7])}return b}(function(r){for(var n=Array(),t=0;t<8*r.length;t+=8)n[t>>5]|=(255&r.charCodeAt(t/8))<<24-t%32;return n}(r=function(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var e=r.charCodeAt(t);e<128?n+=String.fromCharCode(e):(127<e&&e<2048?n+=String.fromCharCode(e>>6|192):(n+=String.fromCharCode(e>>12|224),n+=String.fromCharCode(e>>6&63|128)),n+=String.fromCharCode(63&e|128))}return n}(r)),8*r.length))
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
      "CREATE TABLE user_subscription (userId VARCHAR(255), targetId VARCHAR(255))",
      "CREATE TABLE request (sessionId VARCHAR(255), userId VARCHAR(255) DEFAULT NULL, method TEXT, location TEXT, timestamp INT)"
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

  /**
   * Gets all requests stored in db
   */
  getRequests() {
    return this.query(`SELECT * FROM request`);
  }

  /**
   * figures out if given user has given password
   * @param  {String}  userId   id of the user
   * @param  {String}  password unhashed password
   * @return {Boolean}          is given password corresponding to password on file?
   */
  isPasswordMatching(username, password) {
    return Promise.all([ // asynchronously hash password and get saved password
      db.query(`SELECT user.password FROM user WHERE user.username = '${username}'`),
      this.SHA256(password)
    ])
      .then(rows=>{
        if (rows[0][0].password === rows[1]) { // if passwords match
          return true;
        }
        return false;
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
      VALUES ('${entityId}', '${userId}')`);
  }

  /**
   * Adds a comment
   * @param entityId
   * @param userId
   * @param content
   */
  addComment(entityId, userId, content) {
    return this.query(`INSERT INTO entity_comment (entityId, userId, content)
      VALUES ('${entityId}', '${userId}', ${this.connection.escape(content)})`);
  }

  /**
   * Adds a user
   * @param {String} username desired username
   * @param {String} password unhashed password
   * @param {String} email    email address
   * @param {String} [bio=""] short description of user
   */
  addUser(username, password, email, bio="") {
    return this.query(`INSERT INTO user (userId, username, password, email, bio)
      VALUES ('${this.GUID()}', ${this.connection.escape(username)}, ${this.connection.escape(this.SHA256(password))}, ${this.connection.escape(email)}, ${this.connection.escape(bio)})`);
  }

  /**
   * Adds a subscription
   * @param userId
   * @param targetId
   */
  addSubscription(userId, targetId) {
    return this.query(`INSERT INTO user_subscription (userId, targetId)
      VALUES ('${userId}', '${targetId}')`);
  }

  /**
   * Adds requests performed by the given session
   * @param session
   */
  addRequests(session) {
    var values = session.requests.map(request => {
      return `('${session.sessionId}', ${session.userId ? "'" + session.userId + "'" : "NULL"}, '${request.type}', ${this.connection.escape(request.location)}, ${request.time})`;
    });
    return this.query(`INSERT INTO request (sessionId, userId, method, location, timestamp)
    VALUES ${values.join(", ")}`);
  }


  /* ****
  DELETING METHODS
  **** */

  /**
   * Deletes entity, and all associated data from post, comments, tags, likes
   * @param entityId
   */
  deleteEntity(entityId) {
    return Promise.all([`DELETE FROM entity WHERE entityId = '${entityId}'`,
      `DELETE FROM post WHERE entityId = '${entityId}'`,
      `DELETE FROM photo WHERE entityId = '${entityId}'`,
      `DELETE FROM entity_tag WHERE entityId = '${entityId}'`,
      `DELETE FROM entity_like WHERE entityId = '${entityId}'`,
      `DELETE FROM entity_comment WHERE entityId = '${entityId}'`].map(sql=>{return this.query(sql)}));
  }

  /**
   * Deletes a like
   * @param entityId
   * @param userId
   */
  deleteLike(entityId, userId) {
    return this.query(`DELETE FROM entity_like
      WHERE entityId = '${entityId}' AND userId = '${userId}'`);
  }

  /**
   * Deletes a comment
   * @param entityId
   * @param userId
   * @param content
   */
  deleteComment(entityId, userId, content) {
    return this.query(`DELETE FROM entity_comment
      WHERE entityId = '${entityId}' AND userId = '${userId}' AND content = '${this.connection.escape(content)}'`);
  }

  /**
   * Deletes a user and associated data
   * @param userId
   */
  deleteUser(userId) {
    return Promise.all([`DELETE FROM user WHERE userId = '${userId}'`,
      `DELETE FROM user_subscription WHERE userId = '${userId}'`,
      `DELETE FROM entity_like WHERE userId = '${userId}'`,
      `DELETE FROM entity_comment WHERE userId = '${userId}'`,
      `DELETE entity, post, photo FROM entity
        LEFT JOIN post ON post.entityId = entity.entityId
        LEFT JOIN photo ON photo.entityId = entity.entityId
        WHERE entity.userId = '${userId}'`].map(sql=>{return this.query(sql)}));
  }

  /**
   * Deletes a subscription
   * @param userId
   * @param targetId
   */
  deleteSubscription(userId, targetId) {
    return this.query(`DELETE FROM user_subscription
      WHERE userId = '${userId}' AND targetId = '${targetId}'`);
  }

  /* ****
  UPDATING METHODS
  **** */

  /**
   * Updates the given post's content
   * @param entityId
   * @param newContent
   */
  updatePost(entityId, newContent) {
    return this.query(`UPDATE post SET content = ${this.connection.escape(newContent)}
      WHERE entityId = '${entityId}'`);
  }

  /**
   * Updates given user
   * @param userId
   * @param props -- username, password, email, bio
   */
  updateUser(userId, props = {}) {
    var updateStatements = Object.keys(props).map(key => {
      return `${key} = ${this.connection.escape(props[key])}`;
    });
    return this.query(`UPDATE user SET ${updateStatements.join(`, `)}
      WHERE userId = '${userId}'`);
  }

  /**
   * Updates given comment
   * @param entityId
   * @param userId
   * @param oldContent
   * @param newContent
   */
  updateComment(entityId, userId, oldContent, newContent) {
    return this.query(`UPDATE entity_comment SET content = ${this.connection.escape(newContent)}
      WHERE entityId = '${entityId}' AND userId = '${userId}' AND content = ${this.connection.escape(oldContent)}`);
  }
}
const db = new Database();

module.exports = db;
