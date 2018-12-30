class SessionManager {
  constructor(db) {
    this.sessionObjects = [];
    this.sessionIds = {};

    this.database = db;

    // for colorful output
    // http://voidcanvas.com/make-console-log-output-colorful-and-stylish-in-browser-node/
    this.color = {
      reset: "\x1b[0m",
      red: "\x1b[31m",
      red_bg: "\x1b[41m"
    }
  }

  /**
   * finds the correct session and handles everything
   * @param req
   * @return req -- now with req.session as the session
   */
  manageRequest(req, res) {
    var curSession;
    // form curSession...
    if (req.cookies && req.cookies.sessionId && this.sessionObjects[this.sessionIds[req.cookies.sessionId]]) { // if there's a sessionId already (and we have it stored)...
      curSession = this.sessionObjects[this.sessionIds[req.cookies.sessionId]]; // get curSession
    } else { // if there's no sessionId yet...
      curSession = new Session(); // create and store the session
      this.sessionIds[curSession.sessionId] = this.sessionObjects.length;
      this.sessionObjects.push(curSession);
      this.addSessionTimeout(curSession); // make sure it can timeout
    }
    console.log(`\t[SessionManager] '${curSession.sessionId}' ${req.method} '${req.originalUrl}'`);

    // update the cookie timeout (client side)
    res.cookie('sessionId', curSession.sessionId, {maxAge: curSession.timeout});
    // log the request
    curSession.logRequest(req);
    // and return it for further use
    req.session = curSession
    return req;
  }

  /**
   * handles session timeouts
   * @param session
   * @param timeout
   */
  addSessionTimeout(session, timeout=session.timeout) {
    setTimeout(()=>{
      if (Date.now() >= timeout + session.lastReqTimestamp) { // if truly timed out...
        console.log(`${this.color.red}\t[SessionManager] removing '${session.sessionId}'${this.color.reset}`);
        session.saveToDB(this.database); // save the session to the database
        delete this.sessionObjects[this.sessionIds[session.sessionId]]; // remove from current sessions
        delete this.sessionIds[session.sessionId];                      // and current sessions index
      } else { // if !timed out... set new timeout for estimated timeout time (+1sec)
        this.addSessionTimeout(session, session.timeout - (Date.now() - session.lastReqTimestamp) + 1000)
      }
    }, timeout);
  }
}


/**
 * Data-structure for holding session information
 */
class Session {
  constructor() {
    this.sessionId = "ss-s-s-s-sss".replace(/s/g, s4);
    this.userId = "62b8f202-f0df-2411-a216-8bd9eee2073d"; //TODO: EVERYTHING is logged in!!
    this.timeout = (1000*60)*45; // 45 minute(s)
    this.lastReqTimestamp = Date.now();
    this.requests = [];
    /* single request structure should look like this:
    {
      type: "GET",
      location: "http://localhost:3000/posts",
      time: (timestamp)
    }
    */
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
  }

  /**
   * TODO: save request details
   * @param req
   */
  logRequest(req) {
    this.lastReqTimestamp = Date.now(); // update timeout
    this.requests.push({
      type: req.method,
      location: req.originalUrl,
      time: Date.now()
    });
  }

  /**
   * saves requests to db. Run when deleting request
   * //TODO: uncomment to enable saving!!!
   * @param db
   */
  saveToDB(db) {
    // db.addRequests(this);
  }
}

module.exports = SessionManager;
