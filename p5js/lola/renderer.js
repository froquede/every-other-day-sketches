var framerate = 24;
var motion_blur = 1;
var capturer = new CCapture({
    format: 'webm',
    framerate: framerate,
    workersPath: 'node_modules/ccapture.js/src/',
    // verbose: true,
    motionBlurFrames: motion_blur
});

var time_stop = 10 * 1000;
var total = (time_stop / 1000) * (framerate * (motion_blur));
var rendered_count = 0;
var stop = false;
var saved = false;
function startCapture() {
    rendered_count = 0;
    capturer.start();
    render();
    setTimeout(function () {
        stop = true;
        if (saved !== true) {
            capturer.stop();
            capturer.save();
            saved = true;
        }
    }, time_stop);
}

function render() {
    if (stop === false) {
        capturer.capture(canvas);
        rendered_count++;
        console.log('Render process: ' + ((rendered_count / total) * 100).toFixed(2) + '%');
        requestAnimationFrame(render);
    }
}