var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var expressWs = require('express-ws')(app);
var path = require('path');
var fs = require('fs');

app.use(bodyParser.json()); // support json encoded bodies

var openWebsockets = [];

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/roomba', function (req, res) {
  fs.appendFileSync('messages.log', JSON.stringify(req.body) + "\n");

  openWebsockets.forEach(function (ws) {
    ws.send(JSON.stringify(req.body));
  });
  res.send('Succes!')
})

app.ws('/updates', function (ws, req) {
  openWebsockets.push(ws);

  ws.on('close', function close() {
    var index = openWebsockets.indexOf(ws);
    if (index > -1) {
      openWebsockets.splice(index, 1);
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
