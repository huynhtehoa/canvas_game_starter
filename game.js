/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

// Create canvas
let canvas;
let ctx;

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let bgReady, catReady, sushiReady, cageReady, ramenReady;
let bgImage, catImage, sushiImage, cageImage, ramenImage;

let startTime = Date.now();
let SECONDS_PER_ROUND = 3;
let elapsedTime = 0;
let remainingTime;

let score = 0;
let round = 0;
let totalScore = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/sushi-background.jpg";
  catImage = new Image();
  catImage.onload = function () {
    // show the cat image
    catReady = true;
  };
  catImage.src = "images/meme-cat-face.png";

  sushiImage = new Image();
  sushiImage.onload = function () {
    // show the sushi image
    sushiReady = true;
  };
  sushiImage.src = "images/kawaii-sushi.png";

  cageImage = new Image();
  cageImage.onload = function () {
    // show the cage image
    cageReady = true;
  };
  cageImage.src = "images/cage.png";

  ramenImage = new Image();
  ramenImage.onload = function () {
    // show the ramen image
    ramenReady = true;
  };
  ramenImage.src = "images/ramen.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that catX represents the X position of our cat.
 * catY represents the Y position.
 * We'll need these values to know where to "draw" the cat.
 * 
 * The same applies to the sushi.
 */

let catX = canvas.width / 2;
let catY = canvas.height / 2;

let sushiX = Math.round(Math.random() * canvas.width);
let sushiY = Math.round(Math.random() * canvas.height);

let cageX = Math.round(Math.random() * canvas.width);
let cageY = Math.round(Math.random() * canvas.height);

let ramenX = Math.round(Math.random() * canvas.width);
let ramenY = Math.round(Math.random() * canvas.height);

let sushiDirectionX = 1;
let sushiDirectionY = 1;
let hasntRestarted  = true;

let cageDirectionX = 1;
let cageDirectionY = 1;


/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the sushi has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown) { // Player is holding up key
    catY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    catY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    catX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    catX += 5;
  }

  // Cat moves through borders
  if (catX > canvas.width - 32) {
    catX -= canvas.width;
  } else if (catX < 0) {
    catX += canvas.width;
  }

  if (catY > canvas.height - 32) {
    catY -= canvas.height;
  } else if (catY < 0) {
    catY += canvas.height;
  }

  //Sushi bounces back
  sushiX += sushiDirectionX * 2;
  sushiY += sushiDirectionY * 2;

  if (sushiX > canvas.width - 32 || sushiX < 0) {
    sushiDirectionX = -sushiDirectionX;
  }

  if (sushiY > canvas.height - 32 || sushiY < 0) {
    sushiDirectionY = -sushiDirectionY;
  }

  //Cage bounces back
  cageX += cageDirectionX * (round * 1);
  cageY += cageDirectionY * (round * 1);

  if (cageX > canvas.width - 32 || cageX < 0) {
    cageDirectionX = -cageDirectionX;
  }

  if (cageY > canvas.height - 32 || cageY < 0) {
    cageDirectionY = -cageDirectionY;
  }


  // Check if player and sushi collided.
  if (
    catX <= (sushiX + 50)
    && sushiX <= (catX + 50)
    && catY <= (sushiY + 50)
    && sushiY <= (catY + 50)
  ) {
    // Pick a new location for the sushi.
    // Note: Change this to place the sushi at a new, random location.
    sushiX = Math.round(Math.random() * canvas.width);
    sushiY = Math.round(Math.random() * canvas.height);
    ramenX = Math.round(Math.random() * canvas.width);
    ramenY = Math.round(Math.random() * canvas.height);

    // Increase score by 1 for every collision
    totalScore++;
    score++;

    // Increase time by 2s for every collision
    SECONDS_PER_ROUND += 2;
  };

  if (
    catX <= (cageX + 50)
    && cageX <= (catX + 50)
    && catY <= (cageY + 50)
    && cageY <= (catY + 50)
  ) {
    // Pick a new location for the cage.
    // Note: Change this to place the cage at a new, random location.
    cageX = Math.round(Math.random() * canvas.width);
    cageY = Math.round(Math.random() * canvas.height);

    // Lose if cat and cage collided
    alert("My cat get caught 🙀. Auto restarting...");
    reset();
  }

  if (
    catX <= (ramenX + 30)
    && ramenX <= (catX + 30)
    && catY <= (ramenY + 30)
    && ramenY <= (catY + 30)
  ) {
    // Pick a new location for the ramen.
    // Note: Change this to place the ramen at a new, random location.
    ramenX = Math.round(Math.random() * canvas.width);
    ramenY = Math.round(Math.random() * canvas.height);

    // Lose if cat and ramen collided
    alert("My cat needs to 💩. Auto restarting...");
    reset();
  }

  // Everytime score reaches multiples 5 => round++ and add previous score to totalScore;
  if (score == 3) {
    round++;
    score = 0;
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  remainingTime = SECONDS_PER_ROUND - elapsedTime;

  // Reset if remaining time = 0;
  if (remainingTime === 0 && hasntRestarted === true) {
    hasntRestarted = false;
    alert("Out of time 😿. Auto restarting...");
    return reset();
  }

  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (catReady) {
    ctx.drawImage(catImage, catX, catY);
  }
  if (sushiReady) {
    ctx.drawImage(sushiImage, sushiX, sushiY);
  }
  if (cageReady) {
    ctx.drawImage(cageImage, cageX, cageY);
  }
  if (ramenReady) {
    ctx.drawImage(ramenImage, ramenX, ramenY);
  }
  document.getElementById("remaining-time").innerHTML = `${remainingTime}`;
  document.getElementById("total-score").innerHTML = `${totalScore}`;
  document.getElementById("round").innerHTML = `${round}`;
};

// Reset game
var reset = function () {
  window.location.reload();
}

// Music control
var myAudio = document.getElementById("audio");
var isPlaying = true;

myAudio.autoplay = true;

function togglePlay() {
  if (isPlaying) {
    myAudio.pause();
    document.getElementById("audio-button").innerHTML = "🎼 Start";
    document.getElementById("audio-button").className = "btn btn-success";

  } else {
    myAudio.play();
    document.getElementById("audio-button").innerHTML = "Pause 🎹";
    document.getElementById("audio-button").className = "btn btn-warning text-white";
  }
};
myAudio.onplaying = function() {
  isPlaying = true;
};
myAudio.onpause = function() {
  isPlaying = false;
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our cat and sushi)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();

