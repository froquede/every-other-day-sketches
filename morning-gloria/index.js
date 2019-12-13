let video, amplitude;

function setup() {
    createCanvas(480, 360);
    // specify multiple formats for different browsers
    video = createVideo(['video.mp4']);
    video.hide(); // by default video shows up in separate dom
    // element. hide it and draw it to the canvas
    // instead
    noStroke();
}

let running;
let timer = 10;
function draw() {
    background(150);
    image(video, 0, 0); // draw the video frame to canvas
    filter(GRAY);
    if (!running) {
        // video.volume(0);
        video.loop();
        running = true;
    }
    loadPixels();
    const d = pixelDensity();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const i = 4 * d * (y * d * width + x);
            const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]]; // get colors
            if (r + g + b >= 600 - (sin(timer) * 50)) { // if r g b all less than 80 then color will appear black
                stroke(r * 1.2, g * 1.2, b * 1.2);
                point(x - 20  + (10 * sin(timer)), y - 20  + (10 * cos(noise(timer))));
            }
        }
    }

    timer += 0.1;
}