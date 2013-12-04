var express = require('express');
var http    = require('http');

var app = express();
app.use(express.bodyParser());
app.set('port', 3000);
app.use(express.static(__dirname + '/public'));

var data = [
    { "name": "Dagny Taggart", "age": 39 },
    { "name": "Francisco D'Anconia", "age": 40 },
    { "name": "Hank Rearden", "age": 46 }
];

app.get('/users', function(req, res) {
    res.send(data);
});

app.post('/users', function(req, res) {
    data.push(req.body);
    res.send(data);
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port: ' + app.get('port'));
});
