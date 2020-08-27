//---------- AUDIO ----------------------------
let partOne;
let trackOnePattern = [1, 0, 0, 0, 1, 0, 0, 0];
let trackOneIteration = 0;
let trackTwoPattern = [0, 0, 1, 0, 0, 0, 0, 0];
let trackTwoIteration = 0;
let trackThreePattern = [0, 0, 0, 0, 0, 0, 1, 0, 0];
let trackThreeIteration = 0;
let trackNoisePattern = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let trackNoiseIteration = 0;
let env;

//--VOICES----------------
let monoSynthDeep, monoSynthMid, monoSynthHigh, mrNoisy;

//--NOTE PATTERN--------------
let notePatternDeep = [45, 47, 48, 50, 52, 53, 56];
let notePatternMid = [57, 59, 60, 62, 64, 65, 68]
let notePatternHigh = [69, 71, 72, 74, 76, 77, 80];

//---------- VISUALS --------
const circles = [];

//--SETUP--------------------

function setup() {
  //--CANVAS------------
  let cnv = createCanvas(1200, 1000);
  background(0);
  textAlign(CENTER, CENTER);
  text('tap to play', width / 2, height / 2);

  cnv.mousePressed(playMyPart);

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
  //partOne.addPhrase(trackNoisePhrase);
  partOne.setBPM(30);
  partOne.loop();

  //--VOICE 1--
  monoSynthDeep = new p5.MonoSynth();
  monoSynthDeep.amp(0.9);
  //--VOICE 2--
  monoSynthMid = new p5.MonoSynth();
  monoSynthMid.amp(0.9);
  //--VOICE 3--
  monoSynthHigh = new p5.MonoSynth();
  monoSynthHigh.amp(0.9);

  //--NOISE AMP ENVELOPE--
  env = new p5.Envelope();

  //--MR NOISY--
  mrNoisy = new p5.Noise("pink");
  mrNoisy.amp(env);

    //--SLIDER NOISE VOLUME--
    setVolume = createSlider(-60, 0, -60, 0); //-60dB max
    setVolume.position(130, 10);
    // input event listenter with anonymus fuction
    setVolume.input(function() {
      mrNoisy.amp(pow(10, setVolume.value()/20), 0.01)
    })


  //--DELAY processing--
  delay = new p5.Delay();
  delay.process(monoSynthDeep, 0.75, 0.3, 3000);
  delay.process(monoSynthMid, 0.75, 0.3, 3000);
  delay.process(monoSynthHigh, 0.75, 0.3, 3000);
  delay.amp(0.9);

  //--REVERB processing--
  reverb = new p5.Reverb();
  reverb.process(monoSynthDeep, 9, 8, false);
  reverb.process(monoSynthMid, 9, 8, false);
  reverb.process(monoSynthHigh, 9, 8, false);
  reverb.process(mrNoisy, 9, 8, false);
  reverb.amp(0.9);


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

  monoSynthDeep.play(note, 0.5, time);
  monoSynthDeep.setADSR(2, 3, 1, 2);
}

// TRACK 2----------------------------
function trackTwo(time) {
  let randomNote = random(notePatternMid);
  let note = midiToFreq(randomNote);
  
  monoSynthMid.play(note, 0.5, time);
  monoSynthMid.setADSR(2, 3, 1, 2);
}

// TRACK 3----------------------------
function trackThree(time) {
  let randomNote = random(notePatternHigh);
  let note = midiToFreq(randomNote);

  monoSynthHigh.play(note, 0.5, time);
  monoSynthHigh.setADSR(2, 3, 1, 2);
}

// TRACK 4----------------------------
function trackNoise() {
  //env.set(4, 0.1, 1, 0.1, 2, 0.1);
  mrNoisy.start();
  env.setADSR(4, 0.7, 0.7, 4);
  //env.setExp();
  env.play();
}

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
