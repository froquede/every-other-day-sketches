let time = 0;
// Sunset
var canvas = document.getElementById('sunset');
var context = canvas.getContext('2d');

// New Retina canvas
canvas.width = 600;
canvas.height = 1000;
canvas.style.width = '300px';
canvas.style.height = '500px';
context.scale(2, 2);

var width = canvas.width / 2;
var height = canvas.height / 2;
var simplex = new SimplexNoise();

context.fillStyle = '#002F40';
var radius = (1.1 * height) / 2;
var circle = { x: width / 4, y: height / 4, radius };
var frequency = 1.4;
var magnitude = 0.2;
var independence = 0.03;
var spacing = .1;
var count = 162;

var colors = [
    '#002F40', // Dark Blue
    '#005F73', // Medium Blue
    '#00ACB9', // Light Blue
    '#664D5C', // Dull Red
    '#BC6A60', // Medium Red
    '#D9A8AF', // Light Red
    '#EB783C', // Medium Orange
    '#FFA051', // Light Orange
    '#FECA55', // Yellow
];

let current = { ...circle };
current.radius /= magnitude + 1;
let original = current.radius;

function sunset() {
    current.radius = +original;
    context.fillRect(0, 0, canvas.width, canvas.height)

    // setTimeout(() => {
        for (let i = 0; i < count; i++) {
            drawDeformedCircle(
                current,
                frequency,
                magnitude,
                i * independence,
                colors[i % colors.length],
            );
            current.radius *= 1 - spacing;
        }
    
        time += .05;
        setTimeout(sunset, 0);
    // }, 0);
}

function drawDeformedCircle(circle, frequency, magnitude, seed, color) {
    context.translate(width / 2, height / 2);
    context.beginPath();
    const samples = Math.floor(4 * circle.radius + 20);
    for (let j = 0; j < samples + 1; ++j) {
        const angle = (2 * Math.PI * j) / samples;

        // Figure out the x/y coordinates for the given angle
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        // Randomly deform the radius of the circle at this point
        const deformation =
            simplex.noise3D(x * frequency, y * frequency, seed) + (15 + (30 * Math.sin(time)));
        const radius = circle.radius * (1 + magnitude * deformation);

        // Extend the circle to this deformed radius
        context.lineTo(radius * x, radius * y);
    }

    context.fillStyle = color;
    context.fill();
    context.strokeStyle = hexToRGBA(color, 0.5);
    context.stroke();
    context.translate(-(width / 2), -(height / 2));
}

function hexToRGBA(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

sunset();