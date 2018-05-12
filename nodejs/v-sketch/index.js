const getpixels = require('get-pixels');
const request = require('request');
var ip = process.argv[2];

var getter = require("pixel-getter");
var actualFrame;
var time = 0;

function getImage(){
    getter.get('http://' + ip + ':8080/shot.jpg', function(err, pixels) {
        // for(var p = 0; p < pixels[0].length; p++){
        //     var pixel = pixels[0][p];
        //     var n = Math.sin(p * time);

        //     for(var c in pixel){
        //         pixel[c] = +pixel[c] * n;
        //     }
        //     // time += 0.1;
        // }
        actualFrame = pixels;
    });

}

// setInterval(getImage, 1000);

var express = require('express');
var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });  
app.use(express.static('public'));
app.listen(3000);

app.get('/frame', (req, res) =>  request({
    url: 'http://192.168.15.3:8080/video',
    method: req.query.method
}).pipe(res)
);