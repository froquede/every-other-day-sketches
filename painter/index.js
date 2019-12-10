var c, ctx, img, PARAMS;
window.onload = function () {
    c = document.getElementById("main");
    c2 = document.getElementById("auxiliar");
    c3 = document.getElementById("image");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    ctx = c.getContext("2d");
    ctx2 = c2.getContext("2d");
    ctx3 = c3.getContext("2d");
    img = document.querySelector("img");
    referenceimg = document.querySelector(".target")
    ctx.globalAlpha = 1;
    paint();
};

let brushX = 40;
let brushY = 24;
let randomX, randomY, randomposX, randomposY;
let mantainBrush = 2;
let count = mantainBrush;
const TO_RADIANS = Math.PI / 180;
let time = 0;

function paint() {
    if (count >= mantainBrush) {
        // brushX = Math.random() * 24;
        // brushY = brushX;
        randomX = parseInt((Math.random() * img.clientWidth) - brushX);
        randomY = parseInt((Math.random() * img.clientHeight) - brushY);
        count = 0;
        // mantainBrush = Math.random() * 20;
        if (randomX < 0) randomX = 0
        if (randomY < 0) randomY = 0
    }
    calculateColor().then(({ x = 0, y = 0 }) => {
        ctx.globalAlpha = Math.random() / 1.2;
        ctx.drawImage(img, randomX, randomY, randomX + brushX, randomY + brushY, x, y, brushX * 1.1, brushY * 1.1);
        // ctx.rotate((1 * Math.random >= .5 ? -1 : 1) * ((360 * Math.random()) * TO_RADIANS));
        ctx.rotate(Math.cos(time * 10) * TO_RADIANS);
        ctx.translate(Math.sin(time) * 2, Math.cos(time));
        count++;
        time += .3;
        setTimeout(paint, 0);
    })
}

function calculateColor() {
    return new Promise((resolve, reject) => {
        c2.width = 5
        c2.height = 5;
        ctx2.drawImage(img, randomX, randomY, randomX + brushX, randomY + brushY, 0, 0, 5, 5);
        let sum = getValue(ctx2, 5, 5);
        let pos = findCorrespondent(sum);
        if (sum === 0) count = mantainBrush;
        resolve(pos);
    })
}

function getValue(context, width, height, x = 0, y = 0) {
    var imgd = context.getImageData(x, y, width, height);
    var pix = imgd.data;
    let s = 0;
    for (var i = 0, n = pix.length; i < n; i += 4) {
        let red = pix[i];
        let green = pix[i+1];
        let blue = pix[i+2];
        let alpha = pix[i+3];
        s += (red + green + blue)
    }
    return s;
}

let tilesX = 40, tilesY = 24;
function findCorrespondent(target) {
    c3.width = tilesX * 5;
    c3.height = tilesY * 5;
    ctx3.drawImage(referenceimg, 0, 0, referenceimg.clientWidth, referenceimg.clientHeight, 0, 0, tilesX * 5, tilesY * 5);
    let diff = [];
    for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
            let t = getValue(ctx3, 5, 5, x * 5, y * 5);
            diff.push({ val: t, x: x, y: y });
        }
    }
    let result = diff.reduce((prev, curr) => Math.abs(curr.val - target) < Math.abs(prev.val - target) ? curr : prev);

    return { x: result.x * tilesX, y: result.y * tilesY };
}