var canvas;
var WIDHT = (1920 / 4), HEIGHT = (1080 / 4);
var LINES;

var _size = 10;
var offset = 50;

function setup() {
    canvas = (createCanvas(WIDHT, HEIGHT)).canvas;
    noStroke();
    background(200);
    capture(canvas);
}

var time = 0;
function draw() {
    background(200);
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            let sini = parseInt(((1.3 + cos(time + randomGaussian(x) / 5)) * 16) / 6);

            if(y == '' + sini){
                fill(255, 255, 255, 255);
            }
            else{
                fill(255, 255, 255, 60);
            }
            ellipse(offset + offset * (x + .2), offset + (offset / 2) * y, _size, _size);
        }
    }
    time += 1 / 30;
}