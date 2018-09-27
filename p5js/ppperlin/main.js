var canvas;
var WIDHT = (1080 / 3), HEIGHT = (1920 / 3);

// function setup() {
//     createCanvas(WIDHT, HEIGHT);
//     noStroke();
//     background(250);
//     strokeWeight(8);
//     capture(canvas);
// }

// var resolution = 12;
// var time = 0;
// function draw() {
//     for (var x = 0; x < WIDHT; x += resolution) {
//         for (var y = 0; y < HEIGHT; y += resolution) {
//             var c = 255 * noise((x / 200), (y / 200));
//             let magic = 255 * sin(c/time + time);
//             stroke(magic, magic + time, magic + magic  * 2);
//             point(x, y);
//         }
//     }
//     time += 60 / 1000;
// }

var t = 10;
// var WIDHT = (1080 / 2), HEIGHT = (1920 / 2);

function setup() {
    createCanvas(WIDHT, HEIGHT);
    stroke(0, 18);
    // strokeWeight(0);
    noFill();
    capture();
}

function draw() {
    // background(240)
    background(240, 2);
    let v = [];
    for(let a = 0; a < 8; a++) {
        v.push(WIDHT * noise(sin(t) + a * 100));
        v.push(HEIGHT * noise(cos(t) + a * 20));
    }

    bezier(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7]);
    bezier(v[8], v[9], v[10], v[11], v[12], v[13], v[14], v[15]);

    t += 0.01;
}