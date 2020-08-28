
//---------- AUDIO ----------------------------
let masterVol;
let partOne;
let trackOnePattern = [1, 0, 0, 0, 1, 0, 0, 0];
let trackTwoPattern = [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0];
let trackThreePattern = [0, 1, 0, 0, 1, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 1, 1];
let trackNoisePattern = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//let trackSawPattern = [0, 1, 0, 1, 0, 0, 1, 0, 1];
let trackBassPattern = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//--VOICES AND ENVELOPES----------------
let monoSynthDeep, monoSynthMid, monoSynthHigh, monoSynthBass, mrNoisy, env, saw;

//--NOTE PATTERN-----Harmonic Minor---------
// let notePatternDeep = [45, 47, 48, 50, 52, 53, 56];
// let notePatternMid = [57, 59, 60, 62, 64, 65, 68]
// let notePatternHigh = [69, 71, 72, 74, 76, 77, 80];

//--NOTE PATTERN-----C Major----------------
let notePatternDeep = [48, 50, 52, 50, 53, 55, 57, 59];
let notePatternMid = [60, 62, 64, 65, 67, 69, 71]
let notePatternHigh = [72, 74, 76, 77, 79, 81, 83];
let notePatternBass = [28, 29, 31];
//let notePatternSaw = [72, 74, 76, 77, 79, 81, 83];

//---------- VISUALS --------
const circles = [];

//--SETUP--------------------

function setup() {
  masterVol = masterVolume(0.9);
  //--CANVAS------------
  let cnv = createCanvas(1200, 1000);
  background(0);
  textAlign(CENTER, CENTER);
  text('tap to play', width / 2, height / 2);

  cnv.mousePressed(playMyPart);

  // let randomPattern = random(trackThreePattern);
  // console.log(trackThreePattern);

  //--PRASES------------
  let trackOnePhrase = new p5.Phrase('trackOne', trackOne, trackOnePattern);
  let trackTwoPhrase = new p5.Phrase('trackTwo', trackTwo, trackTwoPattern);
  let trackThreePhrase = new p5.Phrase('trackThree', trackThree, trackThreePattern);
  let trackNoisePhrase = new p5.Phrase('trackNoise', trackNoise, trackNoisePattern);
  //let trackSawPhrase = new p5.Phrase('trackSaw', trackSaw, trackSawPattern);
  let trackBassPhrase = new p5.Phrase('trackBass', trackBass, trackBassPattern);
  // 
  //--PARTS------------
  partOne = new p5.Part(8, 1/4);
  partOne.addPhrase(trackOnePhrase);
  partOne.addPhrase(trackTwoPhrase);
  partOne.addPhrase(trackThreePhrase);
  partOne.addPhrase(trackBassPhrase);
  // partOne.addPhrase(trackNoisePhrase);
  // partOne.addPhrase(trackSawPhrase);
  partOne.setBPM(120);
  partOne.loop();

  //--VOICE 1--
  monoSynthDeep = new p5.MonoSynth();
  monoSynthDeep.amp(0.9);
  
  //--VOICE 2--
  monoSynthMid = new p5.MonoSynth();
  monoSynthMid.amp(0.9);
  
  //--VOICE 3--
  monoSynthHigh = new p5.MonoSynth();
  monoSynthHigh.amp(0.6);

   //--VOICE Bass--
   monoSynthBass = new p5.MonoSynth();
   monoSynthBass.amp(0.6);

  //PANNER

  //--NOISE AMP ENVELOPE--
  env = new p5.Envelope();

  //--COMPRESSOR--
  comp = new p5.Compressor();

  //--MR NOISY--
  mrNoisy = new p5.Noise("pink");
  mrNoisy.amp(env);
  

   //--VOICE 4--
   //saw = new p5.Oscillator('sawtooth');
   //saw.scale(0.2, 0.2, 0.2, 0.2);
   //saw.amp(env);
  


    //--SLIDER VOLUME--
    setVolume = createSlider(-60, 0, -60, 0); //-60dB max
    setVolume.position(130, 10);
    // input event listenter with anonymus fuction
    setVolume.input(function() {
      monoSynthDeep.amp(pow(10, setVolume.value()/20), 0.01)
    })


  //--DELAY processing--
  delay = new p5.Delay();
  delay.setType("pingPong");
  delay.process(monoSynthDeep, 1/8, 0.5, 500);
  delay.process(monoSynthMid, 1/8, 0.5, 3000);
  delay.process(monoSynthHigh, 2/3, 0.4, 3000);
  delay.amp(0.9);

  //--REVERB processing--
  reverb = new p5.Reverb();
  reverb.process(monoSynthDeep, 9, 8, false);
  reverb.process(monoSynthMid, 9, 8, false);
  reverb.process(monoSynthHigh, 9, 8, false);
  reverb.process(mrNoisy, 9, 8, false);
  reverb.amp(0.9);

  //Compressing the REVERB
  //comp.process(reverb);

  //Stops Visuals
  noLoop();


}
//---------- CIRCLES --------
function draw() {
  clear();
  background(0);

  if(circles.length <100)circles.push(new Circle());
  circles.forEach(c => {
    c.update()
    c.redraw()
  })
}

// TRACK 1----------------------------
function trackOne(time) {
  let randomNote = random(notePatternDeep);
  let note = midiToFreq(randomNote);
  let velocity = random(0.5, 0.9);

  monoSynthDeep.play(note, velocity, time);
  monoSynthDeep.setADSR(1, 3, 1, 2);
}

// TRACK 2----------------------------
function trackTwo(time) {
  let randomNote = random(notePatternMid);
  let note = midiToFreq(randomNote);
  let velocity = random(0.5, 0.9);

  monoSynthMid.play(note, velocity, time);
  monoSynthMid.setADSR(1, 3, 1, 2);
}

// TRACK 3----------------------------
function trackThree(time) {
  let randomNote = random(notePatternHigh);
  let note = midiToFreq(randomNote);
  let velocity = random(0.1, 0.9);
  //let attack = random(0.01, 0.09);
  let decay = random(1, 3);
  //console.log(attack);
  //monoSynthHigh.pan(-1, 4);
  monoSynthHigh.setADSR(1, decay, 1, 1);
  monoSynthHigh.play(note, velocity, time);
 
}

// TRACK 4----------------------------
function trackNoise() {
  //env.set(4, 0.1, 1, 0.1, 2, 0.1);
  mrNoisy.start();
  env.setADSR(4, 0.7, 0.7, 4);
  //env.setExp();
  env.play();
}

// TRACK Bass----------------------------
function trackBass(time) {
  let randomNote = random(notePatternBass);
  let note = midiToFreq(randomNote);
  let velocity = random(0.1, 0.9);
  //let attack = random(0.01, 0.09);
  //let decay = random(0.01, 0.09);
  //console.log(attack);
  //monoSynthHigh.pan(-1, 4);
  monoSynthBass.play(note, velocity, time);
  monoSynthBass.setADSR(0.001, 8, 0, 0);
}

// TRACK 5----------------------------
// function trackSaw(time) {
//   // let randomNote = random(notePatternSaw);
//   // let note = midiToFreq(randomNote);
//   // //env.set(4, 0.1, 1, 0.1, 2, 0.1);
//   // saw.pan(1.0);
//   // saw.start();
//   // //saw.play(note, 0.5, time);
//   // saw.setADSR(0.7, 3, 1, 1);
// }

// PLAY PARTS----------------------------
function playMyPart() {
  userStartAudio();

  if (partOne.isPlaying) {
    partOne.stop();
    mrNoisy.stop();
    noLoop();
  } else {
    partOne.start();
    loop();
    //mrNoisy.start();
  }

}
