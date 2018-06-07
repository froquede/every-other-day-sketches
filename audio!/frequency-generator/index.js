var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration) {
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(
        function(){
            oscillator.stop();
            setTimeout(() => {
                playNote(frequency, duration);
            }, 0)
    }, duration);
}

playNote(240, 240);