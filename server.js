var express = require('express');
var http    = require('http');
var fs      = require('fs');

var app = express();
app.use(express.bodyParser());
app.set('port', 3000);
app.use(express.static(__dirname + '/app'));

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

app.post('/upload', function(req, res) {

    fs.readFile(req.files.file.path, function(err, data) {
        var uploadPath = __dirname + '/uploads/' + req.files.file.name;

        fs.writeFile(uploadPath, data, function(err) {
            if (err) throw err;
            res.redirect('back');
        })

    })

});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port: ' + app.get('port'));
});
