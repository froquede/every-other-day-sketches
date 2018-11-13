var canvas = document.getElementById('canvas');
canvas.width = 1920 / 4;
canvas.height = 1280 / 4;
var ctx = canvas.getContext('2d');

var the_image;
var time = 0;

function animate() {
    time += .06;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FAFAFA';
    ctx.fill();
    drawBeer(canvas.height / 1.2, canvas.height);
}

function drawBeer(h, total) {
    ctx.fillStyle = '#F9C25E';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    for (let a = 0; a < 20; a++) {
        var x = canvas.width - a * (canvas.width / 19);
        var y = total - h + (1 + Math.sin(a / 4 + time) * 10);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(0, total - h);
    ctx.fill();
    image();
}

function image() {
    if (the_image) {
        ctx.drawImage(the_image, 1920 / 8 - 100, 1280 / 8 - 20);
        window.requestAnimationFrame(animate);
    }
    else {
        the_image = new Image();
        the_image.src = 'logo.png';
        the_image.onload = function () {
            ctx.drawImage(the_image, 1920 / 8 - 100, 1280 / 8 - 20);
            window.requestAnimationFrame(animate);
            setTimeout(() => {
                // capture(canvas);
            }, 0);
        }
    }
}

animate();