const express = require('Express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.static(__dirname + '/public')); // static files



// DB
const db = require("./db.js");
db.test();

// ENTRY POINT -- all requests go here
const router_index = require("./routes/index.js");
app.use("/", router_index);


app.listen(3001);
