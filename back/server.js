const express = require('Express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.static(__dirname + '/public')); // point to static files
app.use(cookieParser()); // support cookies
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// ENTRY POINT -- all requests go here
const router_index = require("./routes/index.js");
app.use("/", router_index);


app.listen(3001);
