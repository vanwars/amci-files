const puzzle = document.querySelector('#puzzle');
const puzzleOrig = document.querySelector('#puzzle_orig');
const message = document.querySelector('#message');
const thumbs = document.querySelector('#options');
const numSquaresW = 12;
const numSquaresH = numSquaresW;
const imgOriginalSize = 500;
const scale = 1;
let tries = 0;

var img = new Image();
const images = [
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
    'images/van.jpg'
]


// slice the puzzle based on the size of the original image and
// the number of squares you want:
img.onload = function() {
    buildPuzzles();
    setInterval(shuffleIfNotInCorrectPlace, 50);
};

function loadThumbnails() {
    images.forEach((imgURL, i) => {
        thumbs.insertAdjacentHTML('beforeend', `
            <img 
                src="${imgURL}" 
                alt="${imgURL.replace('.jpg', '')}" 
                onclick="loadPuzzle(${i})" />`
        )
    })
}

function buildOriginal() {
    puzzleOrig.innerHTML = '';
    const pieceSizeW = imgOriginalSize / numSquaresW;
    const pieceSizeH = imgOriginalSize / numSquaresH;
    for (let col = 0; col < numSquaresH; col++) {
        for (let row = 0; row < numSquaresW; row++) {
            
            // 1. calculate the start of the puzzle slice:
            const x = row * pieceSizeW;
            const y = col * pieceSizeH;

            // 2. create a new canvas tag to hold the puzzle piece:
            const canvasID = `c_${col}_${row}`;
            piece = `
                <canvas 
                    id=${canvasID} 
                    width="${pieceSizeW * scale}" 
                    height="${pieceSizeH * scale}"></canvas>`;
            
            // 3. add it to the DOM:
            puzzleOrig.insertAdjacentHTML('beforeend', piece);

            // 4. draw the slice on the appropriate canvas element:
            const canvas = document.getElementById(canvasID);
            const ctx = canvas.getContext('2d');

            // console.log("Drawing a slice of the image on this little 100x100 canvas element: (", x, ",", y, ")");
            ctx.drawImage(img, x, y, pieceSizeW, pieceSizeH, 0, 0, pieceSizeW * scale, pieceSizeH * scale);
        }
    }
}

function buildCopy() {
    puzzle.innerHTML = '';
    for (let col = 0; col < numSquaresH; col++) {
        for (let row = 0; row < numSquaresW; row++) {
            const canvasID = `c_${col}_${row}`;
            const canvas = document.getElementById(canvasID);
            const copy = cloneCanvas(canvas);
            copy.id = `${canvasID}_copy`;
            const holder = `<div class="piece-holder" ondrop="drop(event)" ondragover="allowDrop(event)"></div>`;
            puzzle.insertAdjacentHTML('beforeend', holder)
            puzzle.lastElementChild.appendChild(copy);
            copy.draggable = "true"; 
            copy.addEventListener('dragstart', drag);
        }
    }
    shuffle();
}


function buildPuzzles() {
    buildOriginal();
    buildCopy();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function shuffle() {
    const numShuffles = numSquaresW * numSquaresH * 3;
    const puzzlePieces = document.querySelectorAll('.piece-holder');
        
    for (let i = 0; i < numShuffles; i++) {
        // grab a random piece from the pieces:
        const randomIndex = getRandomInt(puzzlePieces.length);
        const randomPiece = puzzlePieces[randomIndex];
        puzzle.appendChild(randomPiece);
    }
}

function shuffleIfNotInCorrectPlace() {
    const correctPositions = document.querySelectorAll('#puzzle_orig canvas');
    let currentPositions = document.querySelectorAll('#puzzle canvas');
    const placed = [];
    const toBePlaced = Array.from(Array(correctPositions.length).keys())

    // first loop: figure out who's already in teh correct spot:
    for (let i = 0; i < correctPositions.length; i++) {
        if (correctPositions[i].id + "_copy" === currentPositions[i].id) {
            // add to placed array:
            placed.push(i);
            // remove from to be placed array:
            const index = toBePlaced.indexOf(i);
            toBePlaced.splice(index, 1);
        }
    }

    //  second loop:
    //    for each of the unplaced items, randomly generate a new
    //    slot based on the remaining available slots;
    while (toBePlaced.length > 0) {
        currentPositions = document.querySelectorAll('#puzzle canvas');
        
        // let puzzlePieces = document.querySelectorAll('.piece-holder');
        let source = getRandomInt(toBePlaced.length);
        let dest = getRandomInt(toBePlaced.length);
        let iSrc = toBePlaced[source];
        let i = toBePlaced[dest];
        // swap the piece that's currently in the target
        // slot with the piece at slot 0:
        const currentCanvas = currentPositions[iSrc];
        const targetCanvas = currentPositions[i];
        
        // do some DOM swapping:
        swap(currentCanvas, targetCanvas);

        // remove the index:
        toBePlaced.splice(dest, 1);
    }
}

function swap(obj1, obj2) {
     // create marker element and insert it where obj1 is
     var temp = document.createElement("div");
     obj1.parentNode.insertBefore(temp, obj1);
 
     // move obj1 to right before obj2
     obj2.parentNode.insertBefore(obj1, obj2);
 
     // move obj2 to right before where obj1 used to be
     temp.parentNode.insertBefore(obj2, temp);
 
     // remove temporary marker node
     temp.parentNode.removeChild(temp);
}


function checkIfWon() {
    const correctPositions = document.querySelectorAll('#puzzle_orig canvas');
    const currentPositions = document.querySelectorAll('#puzzle canvas');
    for (let i = 0; i < correctPositions.length; i++) {
        if (correctPositions[i].id + "_copy" !== currentPositions[i].id) {
            return;
        }
    }
    message.innerHTML = `You won in ${tries} moves.`;
}

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    console.log('ondragstart', ev.target.id);
    ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    const parentOfSource = document.getElementById(data).parentElement;
    const parentOfTarget = ev.target.parentElement;
    parentOfSource.appendChild(ev.target);
    parentOfTarget.appendChild(document.getElementById(data));
    ++tries;

    message.innerHTML = `Moves: ${tries}`;
    checkIfWon();
}

// function that sets up the layout of each puzzle:
function initCSS(container, numSquaresW, numSquaresH) {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${numSquaresW}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${numSquaresH}, 1fr)`;
    container.style.border = 'solid 10px #CCC';
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}


function initApp () {

    const i = getRandomInt(images.length);
    img.src = images[i]; 

    // init CSS Grids:
    initCSS(puzzleOrig, numSquaresW, numSquaresH);
    initCSS(puzzle, numSquaresW, numSquaresH);

    loadThumbnails();

    message.innerHTML = '&nbsp;';
}

function loadPuzzle(i) {
    message.innerHTML = '&nbsp;';
    tries = 0;
    img.src = images[i]; 
    buildPuzzles();
}

initApp();

