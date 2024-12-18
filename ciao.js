const bpm = 128; 
const beatDuration = 60 / bpm; 
let isDjMode = false;
let wholeSong = false;
let firstTime = true;
Tone.Transport.bpm.value = bpm;

const synth_piano1 = new Tone.Synth().toDestination();
const synth_piano2 = new Tone.Synth(Tone.Synth).toDestination();
const synth_apreggio = new Tone.Synth(Tone.Synth).toDestination();
const synth_bass = new Tone.Synth({
  oscillator: {
      type: 'triangle'
  },
  envelope: {
      attack: 0.2,
      decay: 0.1,
      sustain: 0.5,
      release: 1.5
  },
  filter: {
      type: 'lowpass',
      frequency: 200,
      rolloff: -24,
      Q: 1
  },
  filterEnvelope: {
      attack: 0.2,
      decay: 0.3,
      sustain: 0.3,
      release: 1.5,
      baseFrequency: 100,
      octaves: 3
  }
}).toDestination();
const synth_kick = new Tone.MembraneSynth({
    pitchDecay: 0.1, 
    octaves: 8, 
    oscillator: {
        type: 'sine'
    },
    envelope: {
        attack: 0.005,
        decay: 0.6,
        sustain: 0.02,
        release: 1.6,
        attackCurve: 'exponential'
    }
}).toDestination();
const synth_snare = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    oscillator: {
        type: "square" 
    },
    envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0,
        release: 0.1,
    }
}).toDestination();
const synth_hihat = new Tone.MetalSynth({
    frequency: 400, 
    envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0.01
    },
    harmonicity: 5.1, 
    modulationIndex: 32, 
    resonance: 8000, 
    octaves: 1.5 
}).toDestination();
const riser = new Tone.Player({
    url: "images/80s-Synth-FX-Riser-02.wav", // Sostituisci con il percorso del file locale
    autostart: false, 
    loop: false 
}).toDestination();


const hihatNotes = ["C2", "C2", "C2", "C2"];
const hihatTimes = [0.25, 0.50, 0.25,].map(time => time * beatDuration);

const snareNotes = ["C2", "C2", "C2", "C2"];
const snareTimes = [2, 2].map(time => time * beatDuration);

const kickNotes = ["C1", "C1", "C1", "C1"];
const kickTimes = [1, 1, 1, 1].map(time => time * beatDuration);

const pianoNotes1 = ["Bb4", "Bb4", "A4", "A4", "G4", "G4", "G4"]; 
const pianoTimes1 = [0.5, 0.5, 0.5, 0.5, 0.75, 0.75].map(time => time * beatDuration);

const pianoNotes2 = ["G4", "G4", "F4", "F4", "D4", "D4", "D4"]; 
const pianoTimes2 = [0.5, 0.5, 0.5, 0.5, 0.75, 0.75].map(time => time * beatDuration);

const synthNotes = ["C5", "D5", "F5", "C5", "D5", "F5", "C5", "D5", "F5", "C5", "D5", "G5","C5", "D5", "F5",
"C5", "D5", "F5", "C5", "D5", "F5", "C5", "D5", "F5", "C5", "D5", "Bb5", "C5", "D5", "F5"]; 
const synthTimes = [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.25, 0.25,
 0.25, 0.25, 0.25, 0.25, 0.25,0.25, 0.25, 0.25, 0.25, 0.25, 0.25,0.25, 0.5, 0.25, 0.25, 0.25].map(time => time * beatDuration);

const bassNotes = ['G3', 'G3','F3','F3','Eb3','Eb3','Eb3','Eb3', 'Eb3','F3', 'F3','C3','C3','C3','C3','C3','D3','D3','Eb3','Eb3','Eb3','Eb3','Eb3','F3','F3','G3','G3','G3' ];
const bassTimes = [ 0.5, 0.5, 0.5, 0.5, 0.75, 0.75,0.5,0.5, 0.5, 0.5, 0.5, 0.75, 0.75,0.5,0.5, 0.5, 0.5, 0.5, 0.75, 0.75,0.5,0.5, 0.5, 0.5, 0.5, 0.75, 0.75,0.5,].map(time => time * beatDuration);

function createPart(synth, notes, times, offset = 0) {
    events = notes.map((note, index) => [times.slice(0, index).reduce((a, b) => a + b, 0) + offset, note]);
    part= new Tone.Part((time, note) => {
        synth.triggerAttackRelease(note, "8n", time);
    }, events);
    part.loop = true;
    part.loopEnd = Math.ceil(times.reduce((a, b) => a + b, 0) / beatDuration) * beatDuration;
    return part;
}

const synth_part = createPart(synth_apreggio,synthNotes, synthTimes); 
const piano1_part = createPart(synth_piano1, pianoNotes1, pianoTimes1);
const piano2_part = createPart(synth_piano2, pianoNotes2, pianoTimes2);
const bass_part = createPart(synth_bass, bassNotes, bassTimes);
const kick_part = createPart(synth_kick, kickNotes, kickTimes);
const snare_part = createPart(synth_snare, snareNotes, snareTimes, beatDuration);
const hihat_part = createPart(synth_hihat, hihatNotes, hihatTimes, 0.5 * beatDuration);
const global_parts = [synth_part, piano1_part, piano2_part, bass_part,kick_part, snare_part, hihat_part, riser];

async function startNextSubdivision(parts) {
    await Tone.start();
    Tone.Transport.start();
    console.log(Tone.Transport.now());
    console.log(Tone.Transport.nextSubdivision(4 * beatDuration)- Tone.Transport.now());
    const nextStartTime = Tone.Transport.nextSubdivision(4 * beatDuration);
    parts.forEach(part => part.start(nextStartTime));

}

async function checkTone(){
    if (Tone.Transport.state !== 'started') {
            await Tone.start();
            Tone.Transport.start(); 
            }
}
document.getElementById('startSong').addEventListener('click', async () => {
    if(firstTime){
        firstTime = false;
    }
    wholeSong = true;
    isDjMode = false; 
    global_parts.forEach(part => part.stop());
    checkTone();
    const startSongTime = Tone.Transport.now();
    kick_part.start();
    snare_part.start(8*beatDuration);
    hihat_part.start(16*beatDuration);
    kick_part.stop(32*beatDuration);
    snare_part.stop(32*beatDuration);
    hihat_part.stop(32*beatDuration);

    piano1_part.start(32*beatDuration);
    piano2_part.start(32*beatDuration);
    riser.start(35*beatDuration);

    kick_part.start(48*beatDuration);
    snare_part.start(48*beatDuration);
    hihat_part.start(48*beatDuration);
    bass_part.start(48*beatDuration);
    synth_part.start(64*beatDuration);
    riser.start(64*beatDuration);

    
    

});

document.getElementById('stopSong').addEventListener('click', async () => {
    global_parts.forEach(part => part.stop()); 
    console.log(global_parts.map(part => part.state));
    wholeSong = false;
});

document.getElementById('startPiano').addEventListener('click', async () => {
    if (!wholeSong) {
        if (piano1_part.state === 'started') {
            console.log('piano is already started');
        } else if (firstTime) {
            checkTone();
            console.log(Tone.Transport.nextSubdivision(4 * beatDuration) - Tone.Transport.now());
            piano1_part.start();
            piano2_part.start();
            firstTime = false;
        } else {
            startNextSubdivision([piano1_part, piano2_part]);
        }
    }
});

document.getElementById('stopPiano').addEventListener('click', () => {
    piano2_part.stop();
    piano1_part.stop();
});

document.getElementById('startSynth').addEventListener('click', async() => {
    if (!wholeSong) {
        if (synth_part.state === 'started') {
            console.log('synth is already started');
        } else if (firstTime) {
            checkTone();
            synth_part.start();
            firstTime = false;
        } else {
            startNextSubdivision([synth_part]);
        }
    }
});

document.getElementById('stopSynth').addEventListener('click', () => {
    synth_part.stop();
});

document.getElementById('startBass').addEventListener('click', async() => {
    if (!wholeSong) {
        if (bass_part.state === 'started') {
            console.log('bass is already started');
        } else if (firstTime) {
            checkTone();
            bass_part.start();
            firstTime = false;
        } else {
            startNextSubdivision([bass_part]);
        }
    }
});

document.getElementById('stopBass').addEventListener('click', () => {
    bass_part.stop();
});

document.getElementById('startKick').addEventListener('click', async () => {
    if (!wholeSong) {
        if (kick_part.state === 'started') {
            console.log('kick is already started');
        } else if (firstTime) {
            checkTone();
            kick_part.start();
            firstTime = false;
        } else {
            startNextSubdivision([kick_part]);
        }
    }
});

document.getElementById('stopKick').addEventListener('click', () => {
    kick_part.stop();
});

document.getElementById('startSnare').addEventListener('click', async () => {
    if (!wholeSong) {
        if (snare_part.state === 'started') {
            console.log('snare is already started');
        } else if (firstTime) {
            checkTone();
            snare_part.start();
            firstTime = false;
        } else {
            startNextSubdivision([snare_part]);
        }
    }
});

document.getElementById('stopSnare').addEventListener('click', () => {
    snare_part.stop();
});

document.getElementById('startHiHat').addEventListener('click', async () => {
    if (!wholeSong) {
        if (hihat_part.state === 'started') {
            console.log('hihat is already started');
        } else if (firstTime) {
            checkTone();
            hihat_part.start();
            firstTime = false;
        } else {
            startNextSubdivision([hihat_part]);
        }
    }
});

document.getElementById('stopHiHat').addEventListener('click', () => {
    hihat_part.stop();
});

document.getElementById('startRiser').addEventListener('click', async () => {
    if (!wholeSong) {
        if (riser.state === 'started') {
            console.log('riser is already started');
        } else if (firstTime) {
            checkTone();
            riser.start();
            firstTime = false;
        } else {
            startNextSubdivision([riser]);
        }
    }
});

document.getElementById('stopRiser').addEventListener('click', () => {
    riser.stop();
});
