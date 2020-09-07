//---------BREATHE-------------


let diam = 0;
let change = 0.5;
let alph = 30;

function breathe() {
    let col;
    col = color(200, 200, 200, alph);
    fill(col);

    // diameter change
    diam += change;

    if (diam > width / 7) {
        change = -change;
    } else if (diam < 0) {
        change = -change;
    }

    if (diam > width / 2) {
        alph -= 1;
    } else if (diam < 1) {
        alph += 1;
    }

    circle(windowWidth / 2, windowHeight / 2, diam);
}

