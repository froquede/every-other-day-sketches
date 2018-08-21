var canvas;
var WIDHT = 1000, HEIGHT = 1400;
var LINES;

function setLines(val){
    LINES = +val;
}

function setup() {
    canvas = (createCanvas(WIDHT, HEIGHT)).canvas;
    LINES = 60;
    noSmooth();
    capture(canvas);
}

var time = 0;
function draw() {
    background(240);
    var length = HEIGHT / LINES;
    var middle = WIDHT / 2;
    var last_x = 0;
    for (var i = 0; i < LINES; i++) {
        var s = 240 + (10 + -(i * 2));
        s = s > 240 ? 240 : s;
        stroke(s);
        strokeWeight(1 + (i / 6));
        var new_x = randomGaussian(middle, time) + sin(10 + (time * i / 6.2)) * ((middle - ((LINES - i) * 6)) / 1.2);
        line(last_x, (i - 1) * length, new_x, i * length);
        last_x = new_x;
    }
    time += 0.005;
}