var canvas;
var WIDHT = (1080 / 2), HEIGHT = (1920 / 2);
var LINES;

function setup() {
    canvas = (createCanvas(WIDHT, HEIGHT)).canvas;
    LINES = 100;
    // capture(canvas);
}

var time = 0;
function draw() {
    
    time += 0.005;
}