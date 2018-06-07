var canvas;
var WIDHT = (1080 / 2), HEIGHT = (1920 / 2);
var random_pos;
var token = 'KA.eyJ2ZXJzaW9uIjoyLCJpZCI6IjFOM2hnOHRUVFNPSzhBZW43NHVCTEE9PSIsImV4cGlyZXNfYXQiOjE1MzAzODY2NzMsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.2i_PEFg9OPg8rGl48KWj5QHktAgxmcn3FbCDlLwElZ0';

function setup() {
    canvas = (createCanvas(WIDHT, HEIGHT)).canvas;
    noLoop();
    getUberRides();
    // capture(canvas);
}

var time = 0, anim_count = 0;
function draw() {
    background(255, 50);
}

var travels = [];
var last_pos = 0;
function getUberRides() {
    $.ajax({
        type: "GET",
        url: "https://api.uber.com/v1.2/history?limit=50&offset=" + last_pos,
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (res) {
            if(last_pos <= res.count) {
                last_pos += 50;
                travels = travels.concat(res.history);
                getUberRides();
            }
            else{
                console.log(travels);
            }
        }
    });
}