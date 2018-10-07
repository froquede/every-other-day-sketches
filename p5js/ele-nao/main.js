const textList = ["ELE\nNÃO"];
var textPos = 0;
function createParticles(text) {
    createTextMap(
        text,  // text to display
        40,    // font size
        "Arial",  // font
        {  // style fot rendering font
            fillStyle: "#000",
            strokeStyle: "#fff",
            lineWidth: 4,
            lineJoin: "round",
        }, {  // bounding box to find a best fit for
            top: 0,
            left: 0,
            width: canvas.width,
            height: canvas.height,
        }
    )
}
// This function starts the animations
var started = false;
function startIt() {
    started = true;
    const next = () => {
        // if(!window.capturer) {
        //     capture();
        // }
        var text = textList[(textPos++) % textList.length];
        particles.mouseFX.dist = canvas.height / 8;
        createParticles(text);
        setTimeout(moveOut, text.length * 100 + 15000);
    }
    const moveOut = () => {
        particles.moveOut();
        setTimeout(next, 5000);
    }
    setTimeout(next, 0);
}


function setStyle(ctx, style) {
    Object.keys(style).forEach(key => ctx[key] = style[key]);
}

// the following function create the particles from text using a canvas
// the canvas used is dsplayed on the main canvas top left fro referance.
var tCan = createImage(100, 400); // canvas used to draw text
function createTextMap(text, size, font, style, fit) {
    // function to conver to colour hex value
    const hex = (v) => (v < 16 ? "0" : "") + v.toString(16);
    // set up font so we can find the size.
    tCan.ctx.font = (size * 1.01) + "px " + font;
    // get size of text
    var width = Math.ceil(tCan.ctx.measureText(text).width + size);
    // resize the canvas to fit the text
    tCan.width = width;
    tCan.height = Math.ceil(size * 1.2) * 2;
    // c is alias for context
    var c = tCan.ctx;
    // set up font 
    c.font = size + "px " + font;
    c.textAlign = "center";
    c.textBaseline = "middle";
    // set style
    setStyle(c, style);
    // only do stroke and fill if they are set in styles object
    if (style.strokeStyle) {
        c.strokeText('ELE', width / 2, tCan.height / 4);
        c.strokeText('NÃO', (width / 2) + 2, tCan.height - 30);
    }
    if (style.fillStyle) {
        c.fillText('ELE', width / 2, tCan.height / 4);
        c.fillText('NÃO', (width / 2) + 2, tCan.height - 30);
    }
    // prep the particles
    particles.empty();
    // get the pixel data
    var data = c.getImageData(0, 0, width, tCan.height).data;
    var x, y, ind, rgb, a;
    // find pixels with alpha > 128
    for (y = 0; y < tCan.height; y += 1) {
        for (x = 0; x < width; x += 1) {
            ind = (y * width + x) << 2;  // << 2 is equiv to * 4
            if (data[ind + 3] > 128) {  // is alpha above half
                rgb = `#${hex(data[ind++])}${hex(data[ind++])}${hex(data[ind++])}`;
                // add the particle
                particles.add(Vec(x, y), Vec(x, y), rgb);
            }
        }
    }
    // scale the particles to fit bounding box
    var scale = Math.min(fit.width / width, fit.height / tCan.height);
    particles.each(p => {
        p.home.x = ((fit.left + fit.width) / 2) + (p.home.x - (width / 2)) * scale;
        p.home.y = ((fit.top + fit.height) / 2) + (p.home.y - (tCan.height / 2)) * scale;

    })
        .findCenter() // get center used to move particles on and off of screen
        .moveOffscreen()  // moves particles off the screen
        .moveIn();        // set the particles to move into view.

}
// vector object a quick copy from other code.
function Vec(x, y) {  // because I dont like typing in new
    return new _Vec(x, y);
}
function _Vec(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    return this;
}
_Vec.prototype = {
    setAs(vec) {
        this.x = vec.x;
        this.y = vec.y;
    },
    toString() {
        return `vec : { x : ${this.x}, y : ${this.y} );`
    }
}

// basic particle
const particle = {
    pos: null,
    delta: null,
    home: null,
    col: "black",
}
// array of particles
const particles = {
    items: [], // actual array of particles
    mouseFX: {  // mouse FX
        power:  20,
        dist: 100,
        curve: 3, // polynomial power
        on: true,
    },
    fx: {
        speed: 0.024,
        drag: 0.45,
        size: 2.5,
        jiggle: 3.2,
    },
    // direction 1 move in -1 move out
    direction: 1,
    moveOut() { this.direction = -1; return this },
    moveIn() { this.direction = 1; return this },
    length: 0, // Dont touch this from outside particles.
    each(callback) { // custom iteration 
        for (var i = 0; i < this.length; i++) {
            callback(this.items[i], i);
        }
        return this;
    },
    empty() { // empty but dont dereference
        this.length = 0;
        return this;
    },
    deRef() {  // call to clear memory
        this.items.length = 0;
        this.length = 0;
    },
    add(pos, home, col) {  // adds a particle
        var p;
        if (this.length < this.items.length) {
            p = this.items[this.length++];
            // p.pos.setAs(pos);
            p.home.setAs(home);
            p.delta.x = 0;
            p.delta.y = 0;
            p.col = col;
        } else {
            this.items.push(
                Object.assign(
                    {},
                    particle,
                    {
                        pos,
                        home,
                        col,
                        delta: Vec()
                    }
                )
            );
            this.length = this.items.length
        }
        return this;
    },
    draw() { // draws all
        var p, size, sizeh;
        sizeh = (size = this.fx.size) / 2;
        for (var i = 0; i < this.length; i++) {
            p = this.items[i];
            ctx.fillStyle = p.col;
            ctx.fillRect(p.pos.x - sizeh, p.pos.y - sizeh, size, size);
        }
    },
    update() { // update all particles
        var p, x, y, d;
        var mP = this.mouseFX.power;
        var mD = this.mouseFX.dist;
        var mC = this.mouseFX.curve;
        var fxJ = this.fx.jiggle;
        var fxD = this.fx.drag;
        var fxS = this.fx.speed;

        for (var i = 0; i < this.length; i++) {
            p = this.items[i];
            p.delta.x += (p.home.x - p.pos.x) * fxS + (Math.random() - 0.5) * fxJ;
            p.delta.y += (p.home.y - p.pos.y) * fxS + (Math.random() - 0.5) * fxJ;
            p.delta.x *= fxD;
            p.delta.y *= fxD;
            p.pos.x += p.delta.x * this.direction;
            p.pos.y += p.delta.y * this.direction;
        }
        return this;
    },
    findCenter() {  // find the center of particles maybe could do without
        var x, y;
        y = x = 0;
        this.each(p => {
            x += p.home.x * Math.random();
            y += p.home.y * Math.random();
        });
        this.center = Vec(x / this.length, y / this.length);
        return this;
    },
    moveOffscreen() {  // move start pos offscreen
        var dist, x, y;
        dist = Math.sqrt(this.center.x * this.center.x + this.center.y * this.center.y);

        this.each(p => {
            var d;
            x = p.home.x - Math.random();
            y = p.home.y - Math.random();
            d = Math.max(0.0001, Math.sqrt(x * x + y * y)) * Math.random(); // max to make sure no zeros
            p.pos.x = p.home.x + (x / d) * dist;
            p.pos.y = p.home.y + (y / d) * dist;
        });
        return this;
    },
}
function onResize() {  // called from boilerplate
    if (!started) {
        startIt();
    }
}

/** SimpleFullCanvasMouse.js begin **/
// the following globals are available
// w, h, cw, ch,  width height centerWidth centerHeight of canvas
// canvas, ctx, mouse, globalTime  

//MAIN animation loop
function display() { // call once per frame
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.globalAlpha = 1; // reset alpha
    ctx.clearRect(0, 0, w, h);
    if (tCan) {
        // ctx.drawImage(tCan,0,0);
    }
    particles.update();
    particles.draw();

}




/******************************************************************************
 The code from here down is generic full page mouse and canvas boiler plate 
 code. As I do many examples which all require the same mouse and canvas 
 functionality I have created this code to keep a consistent interface. The
 Code may or may not be part of the answer.
 This code may or may not have ES6 only sections so will require a transpiler
 such as babel.js to run on legacy browsers.
 *****************************************************************************/
// V2.0 ES6 version for Stackoverflow and Groover QuickRun 
var w, h, cw, ch, canvas, ctx, mouse, globalTime = 0;
// You can declare onResize (Note the capital R) as a callback that is also
// called once at start up. Warning on first call canvas may not be at full
// size. 
; (function () {
    const RESIZE_DEBOUNCE_TIME = 100;
    var resizeTimeoutHandle;
    var firstRun = true;
    function createCanvas() {
        var c, cs;
        cs = (c = document.createElement("canvas")).style;
        cs.position = "absolute";
        cs.top = cs.left = "0px";
        cs.zIndex = 1000;
        cs.background = 'black';
        document.body.appendChild(c);
        return c;
    }
    function resizeCanvas() {
        if (canvas === undefined) { canvas = createCanvas() }
        canvas.width = 1080;
        canvas.height = 1920;
        ctx = canvas.getContext("2d");
        if (typeof setGlobals === "function") { setGlobals() }
        if (typeof onResize === "function") {
            clearTimeout(resizeTimeoutHandle);
            if (firstRun) { onResize() }
            else { resizeTimeoutHandle = setTimeout(onResize, RESIZE_DEBOUNCE_TIME) }
            firstRun = false;
        }
    }
    function setGlobals() {
        cw = (w = canvas.width) / 2;
        ch = (h = canvas.height) / 2;
    }
    function done() { // Clean up. Used where the IDE is on the same page.
        window.removeEventListener("resize", resizeCanvas)
        document.body.removeChild(canvas);
        canvas = ctx = undefined;
    }
    function update(timer) { // Main update loop
        if (ctx === undefined) { return }
        globalTime = timer;
        display();           // call demo code;
        requestAnimationFrame(update);
    }
    setTimeout(function () {
        canvas = createCanvas();
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        requestAnimationFrame(update);
    }, 0);
})();
/** SimpleFullCanvasMouse.js end **/
/** CreateImage.js begin **/
// creates a blank image with 2d context
function createImage(w, h) { var i = document.createElement("canvas"); i.width = w; i.height = h; i.ctx = i.getContext("2d"); return i; }
/** CreateImage.js end **/