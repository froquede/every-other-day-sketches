var framerate = 24;
var motion_blur = 1;
var time_stop = 30 * 1000;
var total = (time_stop / 1000) * (framerate * (motion_blur));
var rendered_count = 0;
var stop = false;
var saved = false;
function startCapture(capturer) {
    rendered_count = 0;
    capturer.start();
    render(capturer);
    setTimeout(() => {
        stop = true;
        if (saved !== true) {
            capturer.stop();
            capturer.save();
            saved = true;
        }
    }, time_stop);
}

function render(capturer) {
    if (stop === false) {
        capturer.capture(canvas);
        rendered_count++;
        console.log('Render process: ' + ((rendered_count / total) * 100).toFixed(2) + '%');
        requestAnimationFrame(() => { render(capturer); });
    }
}

function getDateFormated() {
    var date = new Date();
    var day = padZero(date.getDate());
    var month = padZero(date.getMonth());
    var year = date.getFullYear();
    var hours = padZero(date.getHours());
    var minutes = padZero(date.getMinutes());
    var seconds = padZero(date.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function padZero(t, l) {
    return ('0' + t).slice(-l || -2);
}

function capture(canvas) {
    var capturer = new CCapture({
        format: 'webm',
        framerate: framerate,
        workersPath: 'node_modules/ccapture.js/src/',
        motionBlurFrames: motion_blur,
        name: window.document.title + getDateFormated(),
        // display: true,
    });

    startCapture(capturer);
}