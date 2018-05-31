var canvas;
var WIDHT = (1080 / 2), HEIGHT = (1920 / 2);
var random_pos;

function setup() {
    canvas = (createCanvas(WIDHT, HEIGHT)).canvas;
    angleMode(DEGREES);
    LINES = 100;
    random_pos = parseInt(Math.random() * WIDHT);
    random_color_line = parseInt(Math.random() * LINES);
    strokeWeight(WIDHT / LINES);
    capture(canvas);
}

var time = Math.random(), anim_count = 0;
var multiplier = 1.6;
var LINES = 60;
function draw() {
    translate(0, -150 * multiplier);
    rotate(22);
    for (var x = 0; x < LINES; x++) {
        var vw = (WIDHT * multiplier * 1.1) / LINES
        var vx = x * vw;
        if (vx / 2 < random_pos - LINES || vx / 2 > random_pos + vw) {
            if (x >= random_color_line - 2 && x <= random_color_line + 2) {
                strokeWeight(WIDHT * 1.2 / LINES);
                stroke(255, 0, 0);
            }
            else {
                if (x % 2 === 0) {
                    stroke(255);
                }
                else {
                    stroke(0);
                }

                strokeWeight(WIDHT / LINES);
            }



            for (var y = 1; y < LINES; y++) {
                var s = sin(time * ((x * y) / 4)) * noise(time);
                var x1 = vx + (LINES) * (s);
                var y1 = (y * (HEIGHT * multiplier) / LINES);
                point(x1, y1);
            }
        }
    }

    anim_count++;
    time += 0.005;

    background(255, 50);
}