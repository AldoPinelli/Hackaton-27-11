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

function createPart(synth, notes, times) {
    events = notes.map((note, index) => [times.slice(0, index).reduce((a, b) => a + b, 0), note]);
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
const global_parts = [synth_part, piano1_part, piano2_part, bass_part];

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
    synth_part.start();
    piano1_part.start();
    piano2_part.start();
    bass_part.start();

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

