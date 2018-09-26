var canvas;
var WIDHT = (1080 / 2), HEIGHT = (1920 / 2);
var LINES;

function setup() {
    createCanvas(WIDHT, HEIGHT);
    noStroke();
    background(250);
    strokeWeight(8);
    capture(canvas);
}

var resolution = 12;
var time = 0;
function draw() {
    for (var x = 0; x < WIDHT; x += resolution) {
        for (var y = 0; y < HEIGHT; y += resolution) {
            var c = 255 * noise((x / 200), (y / 200));
            let magic = 255 * sin(c/time + time);
            stroke(magic, magic + time, magic + magic  * 2);
            point(x, y);
        }
    }
    time += 60 / 1000;
}