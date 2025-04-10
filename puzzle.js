var rows = 5;
var columns = 5;

var currTile;      // For desktop drag events
var otherTile;
var turns = 0;

var mobileSelected = null; // For mobile tap-to-swap

// Detect mobile/touch environment (or small screen)
var isMobile = ('ontouchstart' in window || window.innerWidth < 768);

window.onload = function() {
  // Initialize the 5x5 board
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.src = "./images/blank.jpg";

      // Attach event listeners based on device type
      if (!isMobile) {
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);
      } else {
        tile.addEventListener("click", mobileSelect);
      }
      document.getElementById("board").append(tile);
    }
  }

  // Create and shuffle puzzle pieces
  let pieces = [];
  for (let i = 1; i <= rows * columns; i++) {
    pieces.push(i.toString());
  }
  pieces.reverse();
  for (let i = 0; i < pieces.length; i++) {
    let j = Math.floor(Math.random() * pieces.length);
    let tmp = pieces[i];
    pieces[i] = pieces[j];
    pieces[j] = tmp;
  }

  // Initialize puzzle pieces
  for (let i = 0; i < pieces.length; i++) {
    let tile = document.createElement("img");
    tile.src = "./images/" + pieces[i] + ".jpg";

    if (!isMobile) {
      tile.addEventListener("dragstart", dragStart);
      tile.addEventListener("dragover", dragOver);
      tile.addEventListener("dragenter", dragEnter);
      tile.addEventListener("dragleave", dragLeave);
      tile.addEventListener("drop", dragDrop);
      tile.addEventListener("dragend", dragEnd);
    } else {
      tile.addEventListener("click", mobileSelect);
    }
    document.getElementById("pieces").append(tile);
  }
};

// ----- Desktop Drag Functions -----
function dragStart() {
  currTile = this;
}
function dragOver(e) {
  e.preventDefault();
}
function dragEnter(e) {
  e.preventDefault();
}
function dragLeave() {
  // No action needed here.
}
function dragDrop() {
  otherTile = this;
}
function dragEnd() {
  if (currTile.src.includes("blank")) return;

  let currImg = currTile.src;
  let otherImg = otherTile.src;

  currTile.src = otherImg;
  otherTile.src = currImg;

  turns++;
  document.getElementById("turns").innerText = turns;

  checkSolution();
}

// ----- Mobile Tap-to-Swap Functionality -----
function mobileSelect() {
  if (!mobileSelected && this.src.includes("blank")) return;

  // First tap: select the tile
  if (!mobileSelected) {
    mobileSelected = this;
    this.classList.add("selected");
  } else {
    // If tapping the same tile, deselect it
    if (this === mobileSelected) {
      this.classList.remove("selected");
      mobileSelected = null;
      return;
    }
    // Otherwise, swap images between selected tile and current tile
    let tempSrc = mobileSelected.src;
    mobileSelected.src = this.src;
    this.src = tempSrc;

    mobileSelected.classList.remove("selected");
    mobileSelected = null;

    turns++;
    document.getElementById("turns").innerText = turns;

    checkSolution();
  }
}

// Check if the puzzle board is solved
function checkSolution() {
  let boardImages = document.querySelectorAll("#board img");
  let allPlaced = true;
  boardImages.forEach(function(img) {
    if (img.src.includes("blank")) {
      allPlaced = false;
    }
  });
  if (allPlaced) {
    document.getElementById("flipButton").style.display = "block";
  }
}

// Optional: Flip board functionality
function flipBoard() {
  const flipCard = document.getElementById("flip-card");
  flipCard.classList.toggle("flipped");
}
