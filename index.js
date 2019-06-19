var map = [];
let mapWidth = 160;
let mapHeight = 75;
let gameRunning = 0;
let generations = 0;

//populate map array with inactive (0) cells
for (let i = 0; i < mapHeight; i++) {
  map.push([]);
  for (let j = 0; j < mapWidth; j++) {
    map[i].push(0);
  }
}

//create canvas and set width and height to number of cells times 10 pixels
let canvas = document.getElementById("canvas");
canvas.width = mapWidth*10;
canvas.height = mapHeight*10;
let context = canvas.getContext("2d");

//main function that draws active cells in each generation
function draw() {
  //create copy of map
  let newmap = [];
  for (let x = 0; x < map.length; x++) {
    newmap.push(map[x].slice());
  }
  //check number of active neighbor cells for each cell
  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
      let neighbors = 0;
      if (map[i-1][j-1] === 1) {
        neighbors++;
      }
      if (map[i-1][j] === 1) {
        neighbors++;
      }
      if (map[i-1][j+1] === 1) {
        neighbors++;
      }
      if (map[i][j-1] === 1) {
        neighbors++;
      }
      if (map[i][j+1] === 1) {
        neighbors++;
      }
      if (map[i+1][j-1] === 1) {
        neighbors++;
      }
      if (map[i+1][j] === 1) {
        neighbors++;
      }
      if (map[i+1][j+1] === 1) {
        neighbors++;
      }
      //modify map based on number of neighbors
      if (map[i][j] === 0 && neighbors === 3) {
        newmap[i][j] = 1;
        context.fillStyle = "black";
      } else if (map[i][j] === 1 && neighbors > 3) {
        newmap[i][j] = 0;
        context.fillStyle = "white";
      } else if (map[i][j] === 1 && (neighbors > 1 && neighbors < 4)) {
        newmap[i][j] = 1;
        context.fillStyle = "black";
      } else {
        context.fillStyle = "white";
        newmap[i][j] = 0;
      }
      context.fillRect(j*10, i*10, 10, 10); //draw new map onto canvas
    }
  }
  generations++;
  document.getElementById("generations").innerHTML = generations;
  map = newmap.slice();
  if (gameRunning === 1) {
    update();
  }
}

//start game
function start() {
  if (gameRunning === 0) {
    gameRunning = 1;
    document.getElementById("startstop").innerHTML = "STOP";
    update();
  } else {
    gameRunning = 0;
    document.getElementById("startstop").innerHTML = "START";
    update();
  }
}

//reset the canvas to initial state
function clean() {
  generations = 0;
  document.getElementById("generations").innerHTML = generations;
  context.fillStyle = "white";
  context.fillRect(0, 0, mapWidth*10, mapHeight*10);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      map[i][j] = 0;
    }
  }
}

//update function, calls main draw function every 10 milliseconds
function update() {
  let timeout = setTimeout(function() {
    draw();
  }, 10);
  if (gameRunning === 0) {
    clearTimeout(timeout);
  }
}

canvas.addEventListener("mousedown", lineDraw); //start line drawing on mousedonw
canvas.addEventListener("mouseup", removeEvent); //remove mousemove event listener on mouseup


function lineDraw() {
  canvas.addEventListener("mousemove", drawLine);
}

function removeEvent() {
  canvas.removeEventListener("mousemove", drawLine);
}

//follow mouse while clicked and dragged, draw line along path
function drawLine(e) {
  let X = e.offsetX - e.offsetX%10;
  let Y = e.offsetY - e.offsetY%10;
  if (map[Y / 10][X / 10] === 0) {
    map[Y / 10][X / 10] = 1;
    context.fillStyle = "black";
    context.fillRect(X, Y, 10, 10);
  }
}

//activate/deactivate cells by clicking, if active cell is clicked it gets deactivated & vice versa
canvas.onpointerdown = function(e) {
  let X = e.offsetX - e.offsetX%10;
  let Y = e.offsetY - e.offsetY%10;
  if (map[Y/10][X/10] === 0) {
    map[Y/10][X/10] = 1;
    context.fillStyle = "black";
  } else {
    map[Y/10][X/10] = 0;
    context.fillStyle = "white";
  }
  let imgdata = context.getImageData(X, Y, 1, 1);
  context.fillRect(X, Y, 10, 10);
}
