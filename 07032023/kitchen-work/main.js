const piclist = [
    'images/barrel.jpg',
    'images/bike.jpg',
    'images/buildings.jpg',
    'images/cactus.jpg',
    'images/city.jpg',
    'images/drops.jpg',
    'images/feet.jpg',
    'images/fence.jpg',
    'images/flowers.jpg',
    'images/grapes.jpg',
    'images/labrador.jpg',
    'images/plant-water.jpg',
    'images/stuff.jpg',
    'images/tracks.jpg',
    'images/trees.jpg',
    'images/truck.jpg',
    'images/van.jpg',
    'images/boat_h.jpg',
    'images/canoe_h.jpg',
    'images/field_h.jpg',
    'images/field_v.jpg',
    'images/flowers_h.jpg',
    'images/flowers_peach_h.jpg',
    'images/flowers_v.jpg',
    'images/mountain-landscape.jpg',
    'images/rail_h.jpg',
    'images/rail_v.jpg',
    'images/two-cars.jpg',
    'images/typewriter_h.jpg'
];
const puzzle = document.querySelector("#puzzle");
let originalImage = [];
let bgcolor = (document.querySelector("body").style.backgroundColor =
    getBackgroundColor());
let score = 0;
let stopClock = false;
let oMinutes = 5,
    oSeconds = 1;
let pic = parseInt(Math.random() * piclist.length);
let img = new Image();
img.src = piclist[pic];
let numSquares = 4;
let imgOriginalWidth = img.width;
let imgOriginalHeight = img.height;
let pieceWidth = parseInt(imgOriginalWidth / numSquares);
let pieceHeight = parseInt(imgOriginalHeight / numSquares);
//Why does the next line work without () following the function name?
img.onload = makePuzzle;
//It doesn't work with ()
//I need to be able to get the (width/height) of any image
//to use here and possibly resize it to fit.
//How do I query the img to get its width and height?
// function to slice the puzzle based on the size of the original image and
// the number of squares you want:
function makePuzzle() {
    puzzle.innerHTML = "";
    originalImage = [];
    // reset the puzzle dimensions:
    imgOriginalWidth = img.width;
    imgOriginalHeight = img.height;
    // recalculate the width of the pieces:
    pieceWidth = parseInt(imgOriginalWidth / numSquares);
    pieceHeight = parseInt(imgOriginalHeight / numSquares);
    // invoke the set up function:
    initCSS(puzzle, numSquares);
    for (let col = 0; col < numSquares; col++) {
        for (let row = 0; row < numSquares; row++) {
            // 1. calculate the start of the puzzle slice:
            const x = row * pieceWidth;
            const y = col * pieceHeight;
            // 2. create a new canvas tag to hold the puzzle piece:
            const canvasID = `c_${col}${row}`;
            let piece = `
<div class="piece-holder"
style="width:${pieceWidth}; height:${pieceHeight};"
ondrop="drop(event)" ondragover="allowDrop(event)">
<canvas
id=${canvasID}
width="${pieceWidth}"
height="${pieceHeight}"
draggable="true"
ondragstart="drag(event)"></canvas>
</div>
`;
            // 3. add it to the DOM:
            puzzle.insertAdjacentHTML("beforeend", piece);
            // 4. draw the slice on the appropriate canvas element:
            const canvas = document.getElementById(canvasID);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                img,
                x,
                y,
                pieceWidth,
                pieceHeight,
                0,
                0,
                pieceWidth,
                pieceHeight
            );
            originalImage.push(canvasID);
        }
    }
    // after we draw all of the puzzle pieces, we need to
    // shuffle them:
    shuffle();
    document.querySelector("#score").innerHTML = score;
    clock();
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function shuffle() {
    const numShuffles = numSquares * 10;
    const puzzlePieces = document.querySelectorAll(".piece-holder");
    for (let i = 0; i < numShuffles; i++) {
        // grab a random piece from the pieces:
        const randomIndex = getRandomInt(puzzlePieces.length);
        const randomPiece = puzzlePieces[randomIndex];
        puzzle.appendChild(randomPiece);
    }
}
function getBackgroundColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    console.log(r, g, b);
    return `rgb(${r}, ${g}, ${b})`;
}
// function that sets up the layout of each puzzle:
function initCSS(container, numSquares) {
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${numSquares}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${numSquares}, 1fr)`;
    container.style.border = "solid 5px hotpink";
}
// function that sets up the win/lose format of container
function initCSS2(container) {
    container.style.display = "flex";
    container.style.alignContent = "center";
    container.style.justifyContent = "center";
    container.style.border = "none";
}
function clock() {
    document.querySelector("#timer").innerHTML = "";
    let minutes = oMinutes,
        seconds = oSeconds;
    let gameTime = setInterval(() => {
        seconds--;
        if (seconds == 0 && minutes > 0) {
            minutes--;
            seconds = 59;
        }
        if (minutes < 1) {
            document.querySelector("#timer").style = "color:red";
        }
        if (seconds < 10) {
            document.querySelector("#timer").innerHTML =
                minutes + ":0" + seconds;
        } else {
            document.querySelector("#timer").innerHTML =
                minutes + ":" + seconds;
        }
        if (minutes < 1 && seconds < 1) {
            //This stops the clock on a lose.
            setTimeout(() => {
                clearInterval(gameTime);
            });
            lose();
        }
        //This stops the clock on a win
        if (
            document.querySelector("#puzzle").innerHTML ==
            `<img src="${img.src}">`
        ) {
            setTimeout(() => {
                clearInterval(gameTime);
            });
            makeNewPuzzle();
        }
        //This stops the clock when the user chooses their own image:
        if (stopClock == true) {
            setTimeout(() => {
                clearInterval(gameTime);
            });
            stopClock = false;
        }
    }, 1000);
}
function makeNewPuzzle() {
    //These if statements increases difficulty level periodically
    if (score > 0 && score % 20 == 0 && oMinutes > 0) {
        oMinutes--;
        numSquares += 1;
    }
    if (score > 0 && score % 50 == 0) {
        oMinutes += 2;
        numSquares += 2;
    }
    pic = parseInt(Math.random() * piclist.length);
    img = new Image();
    img.src = piclist[pic];
    numSquares = numSquares;
    pieceWidth = parseInt(imgOriginalWidth / numSquares);
    pieceHeight = parseInt(imgOriginalHeight / numSquares);
    bgcolor = document.querySelector("body").style.backgroundColor =
        getBackgroundColor();
    img.onload = makePuzzle;
    initCSS(puzzle, numSquares);
}
function lose() {
    document.querySelector(
        "#puzzle"
    ).innerHTML = `<h2 id="message">Knarly Effort, Dude!</h2>
<button id="restart" onclick="restart()">Restart</button>
`;
    document.querySelector("#score").innerHTML = score;
    initCSS2(puzzle);
}
function restart() {
    score = 0;
    (oMinutes = 5), (oSeconds = 1);
    document.querySelector("#timer").style = "color:white";
    makeNewPuzzle();
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    const parentOfSource = document.getElementById(data).parentElement;
    const parentOfTarget = ev.target.parentElement;
    parentOfSource.appendChild(ev.target);
    parentOfTarget.appendChild(document.getElementById(data));
    let matches = 0;
    for (let i = 0; i < originalImage.length; i++) {
        const puzzlePieces = document.querySelectorAll(".piece-holder canvas");
        if (originalImage[i] == puzzlePieces[i].id) {
            matches++;
        }
    }
    if (matches == originalImage.length) {
        score++;
        if (score % 10 == 0 && oMinutes > 0) {
            oMinutes--;
        }
        document.querySelector("#puzzle").innerHTML = `<img src="${img.src}">`;
        document.querySelector("#score").innerHTML = score;
        document.querySelector("#timer").innerHTML = "";
        initCSS2(puzzle);
    }
}
// new code:
function userChoice(ev) {
    //set global variable to true:
    stopClock = true;
    var reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = function (event) {
        img = new Image();
        img.src = event.target.result;
        img.onload = makePuzzle;
    };
}
// end new code
// New code:
const modalElement = document.querySelector(".modal-bg");
document.querySelector(".open").focus();
function showModalWithImage() {
    // show modal:
    modalElement.classList.remove("hidden");
    // accessibility features:
    modalElement.setAttribute("aria-hidden", "false");
    document.querySelector(".close").focus();
    // update picture:
    document.querySelector(
        ".modal-body"
    ).innerHTML = `<img src="${img.src}" />`;
}
function closeModal() {
    // hide modal:
    modalElement.classList.add("hidden");
    // accessibility features:
    modalElement.setAttribute("aria-hidden", "false");
    document.querySelector(".open").focus();
}
