var five = require("johnny-five");
var board = new five.Board({ 'port': 'COM3' });
var SimplexNoise = require('simplex-noise');

board.on("ready", function () {
	var matrix = new five.Led.Matrix({
		pins: {
			data: 2,
			clock: 3,
			cs: 4
		}
	});

	matrix.on();

	draw(matrix, 0);
});

var perlin = require('perlin-noise');

var simplex = new SimplexNoise(Math.random);
function draw(matrix, e) {
	// matrix.brightness(20);
	let lines = [];

	for (let x = 0; x < 8; x++) {
		let line = [];
		for (let y = 0; y < 8; y++) {
			let val = (1 + simplex.noise2D(x, y + e)) / 2
			if (Math.sin(val) <= .4) {
				line.push(1);
			}
			else {
				line.push(0);
			}
		}
		lines.push(line.join(''));
	}

	e += 0.01;
	matrix.draw(lines);
	// matrix.brightness(0);
	// if(e % 10 <= 5) {
	// 	setTimeout(() => { draw(matrix, e) }, 200)
	// }
	// else {
	// }
	setTimeout(() => { draw(matrix, e) }, 32)
}

function randomZero_One() {
	return Math.round(Math.random());
}

function chunk(arr, len) {

	var chunks = [],
		i = 0,
		n = arr.length;

	while (i < n) {
		chunks.push(arr.slice(i, i += len));
	}

	return chunks;
}