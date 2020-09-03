//---------BREATHE-------------

var diam = 10;
var change = 1.1;

function breathe() {
    var col;
    col = color(255, 255, 255, 170);
    fill(col);

    // diameter change
    diam += change;
    if (diam > width/6) {
      change = -change;
    } else if (diam < 0) {
      change = -change;
    }
    ellipse(windowWidth/2, windowHeight/2, diam, diam);
}
