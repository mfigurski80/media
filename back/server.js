const express = require('Express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.static(__dirname + '/public')); // static files

app.get("/home", function(req, res) {
  res.send("Not static. Or less, at least.");
});

app.listen(8080);
