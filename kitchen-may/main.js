const piclist1 = [
    "images/AMCI.jpg",
    "images/camp.jpg",
    "images/highlake.jpg",
    "images/Killin.png",
    "images/swimmer.jpg",
];
const piclist2 = [
    "images/bike.jpg",
    "images/city.jpg",
    "images/ducklings.png",
    "images/fence.jpg",
    "images/grapes.jpg",
    "images/labrador.jpg",
    "images/minecraft.jpg",
    "images/dragon.jpg",
    "images/sbslogo.png",
    "images/stuff.jpg",
    "images/van.jpg",
];
let originalImage = [];
let bgcolor = (document.querySelector("body").style.backgroundColor =
    getBackgroundColor());
let score = 0;
let oMinutes = 4,
    oSeconds = 59;
let minutes = oMinutes,
    seconds = oSeconds;
const puzzle = document.querySelector("#puzzle");
//I tried this
// let group = parseInt(Math.random()*2);
// if(group==0) {
// let pic = parseInt(Math.random() * piclist1.length);
// let img = new Image();
// img.src = piclist1[pic];
// let imgOriginalWidth = 900;
// let imgOriginalHeight = 600;
// } else {
// let pic = parseInt(Math.random() * piclist2.length);
// let img = new Image();
// img.src = piclist2[pic];
// let imgOriginalWidth = 500;
// let imgOriginalHeight = 500;
// }
//It didn't work. Why??
//I tried putting this in a function so I could load a new puzzle
//with a button click but it doesn't work.
//function setup() {
//I would like to be able to grab any image to use here.
let pic = parseInt(Math.random() * piclist2.length);
let img = new Image();
img.src = piclist2[pic];
let numSquares = 4;
// }
//Maybe this is the wrong place to end the setup function?
//I need to be able to get the (width/height) of any image
//to use here and possibly resize it to fit.
//How do I query the img to get its width and height?
let imgOriginalWidth = 500;
let imgOriginalHeight = 500;
let pieceWidth = parseInt(imgOriginalWidth / numSquares);
let pieceHeight = parseInt(imgOriginalHeight / numSquares);
// slice the puzzle based on the size of the original image and
// the number of squares you want:
img.onload = makePuzzle;

function makePuzzle() {
    document.querySelector("#score").innerHTML = score;
    if (score % 10 == 0 && oMinutes > 0) {
        oMinutes = oMinutes--;
    }
    clock();
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
            // console.log("Drawing a slice of the image on this canvas element:
            //(", x, ",", y, ")");
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
};
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
function initCSS2(container) {
    container.style.display = "flex";
    container.style.alignContent = "center";
    container.style.justifyContent = "center";
    container.style.border = "none";
}
//This clock function sort of works; I'm sure you can teach me
//a better method.
function clock() {
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
        if (minutes == 0 && seconds == 0) {
            //This stops the clock like it should.
            setTimeout(() => {
                clearInterval(gameTime);
            });
            lose();
        }
        //I tried calling this function to stop the clock when puzzle
        //is solved, (i.e., matches == originalImage.length)
        // matchCheck(); //see below
    }, 1000);
}
function lose() {
    document.querySelector(
        "#puzzle"
    ).innerHTML = `<h2 id="message">You Failed!</h2>
<audio autoplay>
<source src="sounds/evil_laugh.m4a" type="audio/m4a">
</audio> `;
    document.querySelector("#score").innerHTML = score;
    initCSS2(puzzle);
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
        console.log(originalImage[i]);
        console.log(puzzlePieces[i].id);
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
        initCSS2(puzzle);
    }
}
//This function should stop the clock if the win condition is met.
function matchCheck() {
    let matches = 0;
    for (let i = 0; i < originalImage.length; i++) {
        const puzzlePieces = document.querySelectorAll(".piece-holder canvas");
        console.log(originalImage[i]);
        console.log(puzzlePieces[i].id);
        if (originalImage[i] == puzzlePieces[i].id) {
            matches++;
        }
    }
    if (matches == originalImage.length) {
        clearInterval(gameTime);
    }
}
// invoke the set up function:
initCSS(puzzle, numSquares);


function makeNewPuzzle() {
    puzzle.innerHTML = '';
    originalImage = []; // change from "const" to "let" (above) so you can reassign
    
    // select a new random image
    // ...
 
    numSquares = 7; // make it harder
    pieceWidth = parseInt(imgOriginalWidth / numSquares);   // change from "const" to "let" (above) so you can reassign
    pieceHeight = parseInt(imgOriginalHeight / numSquares); // change from "const" to "let" (above) so you can reassign
    initCSS(puzzle, numSquares);
    makePuzzle();
}