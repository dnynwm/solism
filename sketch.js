let partOne;
let trackOnePattern = [1, 0, 0, 0, 1, 0, 0, 0];
let trackOneIteration = 0;
let trackTwoPattern = [0, 0, 0, 0, 0, 0, 0, 0];
let trackTwoIteration = 0;
let trackThreePattern = [0, 0, 0, 0, 0, 0, 0, 0];
let trackThreeIteration = 0;
let trackNoisePattern = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let trackNoiseIteration = 0;

let env;

//--VOICES----------------
let monoSynthDeep;
let monoSynthMid;
let monoSynthHigh;

//--NOISE----------------
let mrNoisy;

//--NOTE PATTERN--------------
let notePatternDeep = [51, 54, 58, 61, 63, 66, 70, 73, 75];
let notePatternMid = [61, 64, 68, 71, 73, 76, 80, 83, 85];
let notePatternHigh = [71, 74, 78, 81];

//--SETUP--------------------

function setup() {
  //--CANVAS------------
  let cnv = createCanvas(100, 100);
  cnv.mousePressed(playMyPart);
  background(220);
  textAlign(CENTER, CENTER);
  text('tap to play', width / 2, height / 2);

  //--PRASES------------
  let trackOnePhrase = new p5.Phrase('trackOne', trackOne, trackOnePattern);
  let trackTwoPhrase = new p5.Phrase('trackTwo', trackTwo, trackTwoPattern);
  let trackThreePhrase = new p5.Phrase('trackThree', trackThree, trackThreePattern);
  let trackNoisePhrase = new p5.Phrase('trackNoise', trackNoise, trackNoisePattern);

  //--PARTS------------
  partOne = new p5.Part();
  partOne.addPhrase(trackOnePhrase);
  partOne.addPhrase(trackTwoPhrase);
  partOne.addPhrase(trackThreePhrase);
  partOne.addPhrase(trackNoisePhrase);
  partOne.setBPM(60);
  partOne.loop();

  //--VOICE 1--
  monoSynthDeep = new p5.MonoSynth();
  //--VOICE 2--
  monoSynthMid = new p5.MonoSynth();
  //--VOICE 3--
  monoSynthHigh = new p5.MonoSynth();

  //--NOISE ENVELOPE--
  env = new p5.Envelope();

  //--MR NOISY--
  mrNoisy = new p5.Noise("pink");
  mrNoisy.amp(env);

  //--DELAY processing--
  delay = new p5.Delay();
  delay.process(monoSynthDeep, 0.75, 0.3, 3000);
  delay.process(monoSynthMid, 0.75, 0.3, 3000);
  delay.amp(0.9);

  //--REVERB processing--
  reverb = new p5.Reverb();
  reverb.process(monoSynthDeep, 9, 8, false);
  reverb.process(monoSynthMid, 9, 8, false);
  reverb.process(mrNoisy, 9, 8, false);
  reverb.amp(0.9);

  //Stops Visuals
  noLoop();
}

// TRACK 1----------------------------
function trackOne(time, playbackRate) {
  trackOneIteration++
  //console.log({ time, playbackRate, trackOneIteration })
  //userStartAudio();
  let noteIndex = (trackOneIteration - 1) % notePatternDeep.length;
  let note = midiToFreq(notePatternDeep[noteIndex]);
  let randomMidiValue = random(notePatternDeep[noteIndex] + 1);
  //let note = midiToFreq(randomMidiValue);
  console.log(randomMidiValue);

  monoSynthDeep.play(note, 0.5, time);
  monoSynthDeep.setADSR(2, 3, 1, 2);

  //background(noteIndex * 360 / notePatternDeep.length, 50, 100);
}
// TRACK 2----------------------------
function trackTwo(time, playbackRate) {
  trackTwoIteration++
  //console.log({ time, playbackRate, trackTwoIteration })
  //userStartAudio();
  let noteIndex = (trackTwoIteration - 1) % notePatternMid.length;
  let note = midiToFreq(notePatternMid[noteIndex]);
  //console.log({ noteIndex, note })
  monoSynthMid.play(note, 0.5, time);
  //background(noteIndex * 360 / notePatternMid.length, 50, 100);
}
// TRACK 3----------------------------
function trackThree(time, playbackRate) {
  trackThreeIteration++
  //console.log({ time, playbackRate, trackThreeIteration })
  //userStartAudio();
  let noteIndex = (trackThreeIteration - 1) % notePatternHigh.length;
  let note = midiToFreq(notePatternHigh[noteIndex]);
  //console.log({ noteIndex, note })
  monoSynthHigh.play(note, 0.5, time);
  //background(noteIndex * 360 / notePatternHigh.length, 50, 100);
}

// TRACK 4----------------------------
function trackNoise() {
  mrNoisy.start();
  env.setADSR(2, 1, 1, 4);
  //mrNoisy.amp(0.01);
  env.play();
}

// PLAY PARTS----------------------------
function playMyPart() {
  userStartAudio();
  if (partOne.isPlaying) {
    partOne.stop();
    mrNoisy.stop();
  } else {
    partOne.start();
    //mrNoisy.start();
  }

}