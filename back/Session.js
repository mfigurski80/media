class Session {
  constructor() {
    this.sessionId = "ss-s-s-s-sss".replace(/s/g, s4);
    this.isLoggedIn = false;
    this.userId;
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
    // TODO: write all this stuff
  }

  /**
   * TODO: saves requests to db somehow. Run when deleting request
   * @param db
   */
  saveToDB(db) {
    //TODO: write all this stuff
  }
}

module.exports = Session;
