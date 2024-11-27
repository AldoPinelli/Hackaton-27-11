const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const synth_bass = new Tone.Synth({
  oscillator: {
      type: 'triangle'
  },
  envelope: {
      attack: 0.2,
      decay: 0.3,
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
      sustain: 0.5,
      release: 1.5,
      baseFrequency: 100,
      octaves: 3
  }
}).toDestination();

const kickSynth = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 4,
  oscillator: { type: 'sine' },
  envelope: {
    attack: 0.001,
    decay: 0.4, 
    sustain: 0,
    release: 0.1
  }
}).toDestination();

const hihatSynth = new Tone.MembraneSynth({
  pitchDecay: 0.05,  
  octaves: 6,        
  oscillator: {
    type: 'triangle', 
  },
  envelope: {
    attack: 0.001,    
    decay: 0.02,     
    sustain: 0,       
    release: 0.05    
  }
}).toDestination();

const snareSynth = new Tone.MembraneSynth({
  pitchDecay: 0.1,
  octaves: 4,
  oscillator: { type: 'triangle' }, 
  envelope: {
    attack: 0.005, 
    decay: 0.1,     
    sustain: 0,   
    release: 0.2   
  }
}).toDestination();

const snareNoise = new Tone.NoiseSynth({
  noise: {
    type: 'white'
  },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.1
  }
}).toDestination();

const piano_notes = ["Bb4", "Bb4", "A4", "A4", "G4", "G4", "G4"]; 
const piano_notes_pauses = [0.5, 0.5, 0.5, 0.5, 0.75, 0.75];
const piano_notes1 = ["G4", "G4", "F4", "F4", "D4", "D4", "D4"]; 
const piano_notes_pauses1 = [0.5, 0.5, 0.5, 0.5, 0.75, 0.75];
const bass_notes = ["G2", "F2", "Eb2", "Eb2", "F2", "C2", "C2", "D2", "Eb2", "Eb2", "F2","G2"];
const bass_notes_pauses = [ 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1];



const bpm = 128; 
const beatDuration = 60 / bpm; 

// Variabili per controllare lo stato dei loop
let pianoLoop1;
let pianoLoop2;
let bassLoop;
let kick;
let hihat;
let snare;

function playNotesWithPauses(notes, pauses, startTime = 0, synthInstance = synth, noteDuration = beatDuration) {
  if (notes.length !== pauses.length + 1) {
    console.error("L'array delle pause deve avere una lunghezza pari a notes.length - 1.");
    return;
  }
  let currentTime = startTime; // Inizia dal tempo specificato
  notes.forEach((note, index) => {
    synthInstance.triggerAttackRelease(note, noteDuration, currentTime); // Suona la nota
    if (index < pauses.length) {
      currentTime += pauses[index] * beatDuration; // Aggiungi la pausa
    }
  });
}

function startPianoLoop() {
  const startTime = Tone.now();

  pianoLoop1 = Tone.Transport.scheduleRepeat((time) => {
    playNotesWithPauses(piano_notes, piano_notes_pauses, time, synth, '8n');
  }, 4 * beatDuration);

  pianoLoop2 = Tone.Transport.scheduleRepeat((time) => {
    playNotesWithPauses(piano_notes1, piano_notes_pauses1, time, synth, '8n');
  }, 4 * beatDuration);

  Tone.Transport.start();
}

function startBassLoop(){
    const startTime = Tone.now();
    bassLoop = Tone.Transport.scheduleRepeat((time) => {
    playNotesWithPauses(bass_notes, bass_notes_pauses, time, synth_bass, beatDuration);
  }, 16 * beatDuration);

    Tone.Transport.start();
}

function startDrumLoop() {
  const startTime = Tone.now()
  
  kick = Tone.Transport.scheduleRepeat((time) => {
    kickSynth.triggerAttackRelease('C1', '8n', time);  
  }, beatDuration * 4); 

  snare = Tone.Transport.scheduleRepeat((time) => {
    snareSynth.triggerAttackRelease('D1', '8n', time);
    snareNoise.triggerAttackRelease('16n', time);  
  }, beatDuration * 2); 

  hihat = Tone.Transport.scheduleRepeat((time) => {
    hihatSynth.triggerAttackRelease('E1', '8n', time);  
  }, beatDuration * 0.5); 

  Tone.Transport.start();
}


document.getElementById("startPiano").addEventListener("click", async () => {
  await Tone.start();
  startPianoLoop();
});

document.getElementById("startBass").addEventListener("click", async () => {
  await Tone.start();
  startBassLoop();
});

document.getElementById("startDrums").addEventListener("click", async () => {
  await Tone.start();
  startDrumLoop();
});


document.getElementById("stopPiano").addEventListener("click", stopPiano);
document.getElementById("stopBass").addEventListener("click", stopBass);
document.getElementById("stopDrums").addEventListener("click", stopDrums);

function stopPiano() {
  Tone.Transport.cancel(pianoLoop1);
  Tone.Transport.cancel(pianoLoop2);
}

function stopBass() {
  Tone.Transport.cancel(bassLoop);
}

function stopDrums() {
  Tone.Transport.cancel(kick);
  Tone.Transport.cancel(snare);
  Tone.Transport.cancel(hihat);
}