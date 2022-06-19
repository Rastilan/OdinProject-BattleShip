import _ from "lodash";
import "./style.css";


let root = document.getElementsByTagName("body");
let playerGrid = document.getElementById("player-grid");
let enemyGrid = document.getElementById("enemy-grid");
let playerShips = [];
let enemyShips = [];
let rotation = false;
let gridBoxes = [];
let enemyShipsSunk = 0;
let playersTurn = true;
let gameStarted = false;
let playerShipBeingPlaced = 0;
window.gridBoxes = gridBoxes;
window.enemyShips = enemyShips;

class gridBoxConstructor {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.shipName = "";
    this.clicked = false;
    this.player = player;
  }
}

let gridSize = {
  x: 10,
  y: 10,
  size: 100,
};
class ship {
  constructor(name, size) {
    this.name = name;
    this.size = size;
    this.placed = false;
    this.alive = true;
    this.hit = 0;
  }
}

let carrier = new ship("Carrier", 5);
let battleship = new ship("Battleship", 4);
let destroyer = new ship("Destroyer", 3);
let submarine = new ship("Submarine", 3);
let patrolBoat = new ship("PatrolBoat", 2);
playerShips.push(carrier, battleship, destroyer, submarine, patrolBoat);
enemyShips.push(carrier, battleship, destroyer, submarine, patrolBoat);

// Simple GRID generation
function CreatePlayerGrid() {
  for (let y = 0; y < gridSize.y; y++) {
    for (let x = 0; x < gridSize.x; x++) {
      let gridBox = document.createElement("div");
      gridBox.setAttribute("id", `gridX${x}Y${y}`);
      gridBox.classList.add("grid-box");
      gridBox.setAttribute("onclick", `Clicked(this, ${x}, ${y})`);
      gridBox.setAttribute("onmouseover", `MouseOver(this, ${x}, ${y})`);
      gridBox.setAttribute("onmouseout", `MouseOut(this, ${x}, ${y})`);
      playerGrid.insertBefore(gridBox, playerGrid.children[0]);
      gridBoxes.push(new gridBoxConstructor(`${x}`, `${y}`, "player"));
    }
  }
}



// Simple GRID generation
function CreateEnemyGrid() {
  for (let y = 0; y < gridSize.y; y++) {
    for (let x = 0; x < gridSize.x; x++) {
      let gridBox = document.createElement("div");
      gridBox.setAttribute("id", `enemy-gridX${x}Y${y}`);
      gridBox.classList.add("grid-box");
      gridBox.setAttribute("onclick", `Clicked(this, ${x}, ${y})`);
      enemyGrid.insertBefore(gridBox, enemyGrid.children[0]);
      gridBoxes.push(new gridBoxConstructor(`${x}`, `${y}`, "enemy"));
    }
  }
}



// CONTROL MOUSEOVER WHEN SETTING UP PLAYER SHIPS
function MouseOver(el, x, y) {
  el.classList.add('placing');
}
window.MouseOver = MouseOver;

// CONTROL MOUSEOUT WHEN SETTING UP PLAYER SHIPS
function MouseOut(el, x, y){
  el.classList.remove('placing');
}
window.MouseOut = MouseOut;
// create random INT controller
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function SetupGame(){
    PlacePlayerShipsController();
}
function PlacePlayerShipsController(){

    window.Clicked = (el, x, y) => {
        if (
          gridBoxes.find((val) => {
            if (
              val.x == x &&
              val.y == y &&
              val.placed == false &&
              val.player == "player" &&
              val.clicked
             
            ) {
                console.log(val.x, val.y, val.placed, val.player, val.cliked);
              val.clicked = true;
          }
        })
        );

      };
}



function PlaceEnemeyShipsController() {
  enemyShips.forEach((ship) => {
    if (ship.placed === true) {
      //console.log(ship.name + " already placed");
      //This allows us some recursion to ensure all ships are placed without overlapping eachother
    } else {
      getRandomInt(2) ? (rotation = true) : (rotation = false);
      let placeX = getRandomInt(10);
      let placeY = getRandomInt(10);
      //set max values if selection is rotated
      let origX = placeX;
      let origY = placeY;
      //ensures that no AI placed ship will end up outside of the grid
      origX + ship.size > 10 ? (placeX = origX - ship.size) : (placeX = placeX);
      origY + ship.size > 10 ? (placeY = origY - ship.size) : (placeY = placeY);
      origX + ship.size > 10 ? (origX = origX - ship.size) : (origX = origX);
      origY + ship.size > 10 ? (origY = origY - ship.size) : (origY = origY);

      for (let i = 0; i < ship.size; i++) {
        //repeats the function of the placement is invalid
        if (
          gridBoxes.find((val) => {
            if (val.x == placeX && val.y == placeY && val.placed == true) {
              PlaceEnemeyShipsController();
            }
          })
        )
          break;
        else {
          rotation ? (placeY = placeY + 1) : (placeX = placeX + 1);
        }
        if (i == ship.size - 1) {
          PlaceEnemeyShips(origX, origY, ship);
        }
      }
    }
  });
}
function PlaceEnemeyShips(x, y, ship) {
  let placeX = x;
  let placeY = y;
  for (let v = 0; v < ship.size; v++) {
    if (rotation) {
      gridBoxes.find((val) => {
        if (val.x == placeX && val.y == placeY + v) {
          val.placed = true;
          val.shipName = ship.name;
        }
      });
    } else {
      gridBoxes.find((val) => {
        if (val.x == placeX + v && val.y == placeY) {
          val.placed = true;
          val.shipName = ship.name;
        }
      });
    }
  }
  ship.placed = true;
  // console.log(ship.name, "X: " + placeX, "Y: " + placeY, "Rotated: " + rotation, "Ship Size " + ship.size);
}

window.Clicked = (el, x, y) => {
  if (
    gridBoxes.find((val) => {
      if (
        val.x == x &&
        val.y == y &&
        val.placed == true &&
        val.player == "enemy" &&
        !val.clicked
      ) {
        el.classList.add("hit");
        val.clicked = true;

        enemyShips.find((ship) => {
          if (ship.name == val.shipName) {
            ship.hit++;
            console.log("Hit " + ship.name);
            if (ship.hit == ship.size) {
              console.log("YOU SUNK " + ship.name);
              enemyShipsSunk++;
              if(enemyShipsSunk == 5){
                console.log("YOU WIN");
              }
            }
          }
        });
      }
    })
  );
  else {
    if (!el.classList.contains("hit") && !el.classList.contains("miss")) {
      el.classList.add("miss");
    }
  }
};
CreateEnemyGrid();
CreatePlayerGrid();
PlaceEnemeyShipsController();
