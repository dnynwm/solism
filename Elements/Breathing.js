//---------BREATHE-------------


let diam = 0;
let change = 0.7;
let alph = 30;
let maxDiam = 190;

function breathe() {
    let col;
    col = color(200, 200, 200, alph);
    fill(col);

    // diameter change
    diam += change;

    if (diam > maxDiam) {
        change = -change;
    } else if (diam < 0) {
        change = -change;
    } //width / 10

    // if (diam > width / 2) {
    //     alph -= 1;
    // } else if (diam < 1) {
    //     alph += 1;
    // }

    circle(windowWidth / 2, windowHeight / 2, diam);
}

