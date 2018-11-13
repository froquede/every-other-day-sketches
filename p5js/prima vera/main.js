var canvas;
var colors = ['#443546', '#e7e3e0', '#8f4b6c', '#ce654a', '#835b3c', '#53867c', '#f8c455', '#8b5aa2', '#e83921', '#95ac73'];
var WIDHT = (1920 / 1.5), HEIGHT = (1080 / 2);

var inc = .001;
var scl = 300;
var cols;
var rows;
var zoff = 0;
var particleObejct = 500;
var particles = [];
var flowField;

function setup() {
    canvas = (createCanvas(WIDHT, HEIGHT)).canvas;
    background(color('#f8c455'));
    cols = floor(width / scl);
    rows = floor(height / scl);
    flowField = new Array(cols * rows);
    for (var i = 0; i < particleObejct; i++) {
        particles[i] = new Particle();
    }
}

function colorAlpha(aColor, alpha) {
    var c = color(aColor);
    return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

var time = 0;
function draw() {
    // background(colorAlpha(colors[Math.floor(Math.random() * colors.length)], .01));
    beginShape();
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
        xoff = 0;
        for (var x = 0; x < cols; x++) {
            var index = x + y * cols;
            var angle = noise(xoff, yoff, zoff) * TWO_PI;
            var v = p5.Vector.fromAngle(angle);
            v.setMag(1);
            flowField[index] = v;
            xoff += cos(inc);
        }
        yoff += inc;
    }
    for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].edges();
        particles[i].show();
        particles[i].update();
    }

    if (time <= 5) {
        time += 0.01;
    }
    else {
        time -= sin(time);
    }
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 10;
    this.prePos = this.pos.copy();
    this.update = function () {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel); this.acc.mult(0);
    }
    this.applyForce = function (force) {
        this.acc.add(force);
    }
    this.show = function () {
        stroke(colors[Math.floor(Math.random() * colors.length)]); strokeWeight((this.prePos.x - this.pos.x) / 10 * sin(time)); line(this.pos.x, this.pos.y, this.prePos.x, this.prePos.y);
        this.updatePrev();
    }
    this.updatePrev = function () {
        this.prePos.x = this.pos.x; this.prePos.y = this.pos.y;
    }
    this.edges = function () {
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
        }
        if (this.pos.y < 0) { this.pos.y = height; this.updatePrev(); } if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
        }
    }
    this.follow = function (vectors) {
        var x = floor(this.pos.x / scl);//position in relationship to scale "vector" unit or grid"
        var y = floor(this.pos.y / scl);
        var index = x + y * cols;
        var force = vectors[index];
        this.applyForce(force);
    }
}

