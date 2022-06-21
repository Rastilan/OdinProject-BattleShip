import _ from "lodash";
import "./style.css";


let root = document.getElementsByTagName("body");
let playerGrid = document.getElementById("player-grid");
let enemyGrid = document.getElementById("enemy-grid");
let playerShips = [];
let enemyShips = [];
let rotation = false;
let playerRotation = false;
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

function Rotate(){
  playerRotation = !playerRotation;
}
window.Rotate = Rotate;
// Simple GRID generation
function CreatePlayerGrid() {
  for (let y = 100; y < gridSize.y+100; y++) {
    for (let x = 100; x < gridSize.x+100; x++) {
      let gridBox = document.createElement("div");
      gridBox.setAttribute("id", `gridX${x}Y${y}`);
      gridBox.classList.add("grid-box");
      gridBox.setAttribute("onclick", `PlayerClicked(this, ${x}, ${y})`);
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
  let currentShipSize;
  let currentShip = playerShips[playerShipBeingPlaced];
  if(currentShip == undefined) { currentShipSize = 0; } 
  else { currentShipSize = currentShip.size;}
  for(let i = 0; i < currentShipSize; i++){

    if(playerRotation){ if(document.getElementById(`gridX${x}Y${y+i}`)!= null) { document.getElementById(`gridX${x}Y${y+i}`).classList.add('placing'); }
     } else { if(document.getElementById(`gridX${x+i}Y${y}`)!= null) { document.getElementById(`gridX${x+i}Y${y}`).classList.add('placing'); }
     }
    
  }
 
}
window.MouseOver = MouseOver;

// CONTROL MOUSEOUT WHEN SETTING UP PLAYER SHIPS
function MouseOut(el, x, y){
  el.classList.remove('placing');
  let currentShipSize;
  let currentShip = playerShips[playerShipBeingPlaced];
  if(currentShip == undefined) { currentShipSize = 1; } 
  else { currentShipSize = currentShip.size;}
  
  for(let i = 0; i < currentShipSize+1; i++){

    if(playerRotation){ if(document.getElementById(`gridX${x}Y${y+i}`)!= null) { document.getElementById(`gridX${x}Y${y+i}`).classList.remove('placing'); }
     } else { if(document.getElementById(`gridX${x+i}Y${y}`)!= null) { document.getElementById(`gridX${x+i}Y${y}`).classList.remove('placing'); }
     }
    
  }
}
window.MouseOut = MouseOut;
// create random INT controller
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function EnemyTurn() {
  let x = getRandomInt(10) + 100;
  let y = getRandomInt(10) + 100;
  let el = document.getElementById(`gridX${x}Y${y}`);
  if(el.classList.contains('miss') || el.classList.contains('hit')){
    EnemyTurn();
  }
  else {
    let enemyBoxClicked = (gridBoxes.find((val) => { if(val.x == x && val.y == y){ return val; } else { return null; }    }));
    if(enemyBoxClicked === null) { EnemyTurn();  }{
      console.log(enemyBoxClicked)
        if(enemyBoxClicked.placed == true){
          el.classList.remove("placed");
          el.classList.add("hit");
          enemyBoxClicked.clicked = true;


           playerShips.find((ship) => {
            if (ship.name == enemyBoxClicked.shipName) {
              ship.hit++;
              console.log("Enemy Hit " + ship.name);
              if (ship.hit == ship.size) {
                console.log("ENEMY SUNK YOU " + ship.name);
                enemyShipsSunk++;
                if(enemyShipsSunk == 5){
                  console.log("ENEMY WINS");
                }
              }
            }
          }) 
        }
        else {

          el.classList.add('miss');
        

        }
        

        
    }
  }
}






window.PlayerClicked = (el, x, y) => {
  let origClickX = x;
  let origClickY = y;
  
  let playerShipsSize;
  if(playerShips[playerShipBeingPlaced] == null){ playerShipsSize = 0; } else { playerShipsSize = playerShips[playerShipBeingPlaced].size; }
  for(let i = 0; i < playerShipsSize; i++){
  let currentBoxToClick = (gridBoxes.find((val) => { if(val.x == x && val.y == y){ return val; } else { return null; }    }))
  if(currentBoxToClick != null){
    if(currentBoxToClick.clicked == false){
      if(currentBoxToClick.player == "player"){
    

      if(playerRotation){ if(document.getElementById(`gridX${x}Y${y}`) == null) { break; }
       } else { if(document.getElementById(`gridX${x}Y${y}`) == null) { break; }
       }
       if(currentBoxToClick.clicked == true){ break; } else {

        if( i == playerShipsSize-1){
          for(let b = 0; b < playerShipsSize; b++){
            let boxesToFill = (gridBoxes.find((val) => { if(val.x == origClickX && val.y == origClickY){ return val;} }))
            if(boxesToFill != null){
              boxesToFill.clicked = true;
              boxesToFill.placed = true;
              boxesToFill.shipName = playerShips[playerShipBeingPlaced].name;
              document.getElementById(`gridX${origClickX}Y${origClickY}`).classList.add('placed');
              
              playerRotation ? origClickY++ : origClickX++;
              
            }

            
        } 
        playerShipBeingPlaced++;
        if(playerShipBeingPlaced == 5){ playersTurn = false; }
       }      
      } 
      } else {break;}
    }else {break;}
    
     playerRotation ? y++ : x++;
  }

  
}
  
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


      for (let i = 0; i < ship.size; i++) {
        //repeats the function of the placement is invalid
        if(document.getElementById(`enemy-gridX${placeX}Y${placeY}`) == null) { PlaceEnemeyShipsController(); break;}
        let currentBox = (gridBoxes.find((val) => { if(val.x == placeX && val.y == placeY){ return val; }    }))
        if(currentBox.placed == true){ PlaceEnemeyShipsController(); break; } else {
          rotation ? placeY++ : placeX++;

          if (i == ship.size - 1) {
          
            PlaceEnemeyShips(origX, origY, ship);
            ship.placed = true;
            break;
          }
        }
      }
    }
  });
}
function PlaceEnemeyShips(x, y, ship) {
  let placeX = x;
  let placeY = y;

  if(ship.placed == false){
    for (let v = 0; v < ship.size; v++) {
           let currentBox = (gridBoxes.find((val) => { if(val.x == placeX && val.y == placeY){ return val; }    }));
                currentBox.placed = true;
                currentBox.shipName = ship.name;

                rotation ? placeY++ : placeX++; 
          } 
  }

  }



window.Clicked = (el, x, y) => {
  if(playersTurn == true){ console.log('still players turn') }
    else {
    if ((el.id == `enemy-gridX${x}Y${y}`) &&
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
          EnemyTurn();

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
      if (!el.classList.contains("hit") && !el.classList.contains("miss") && (el.id == `enemy-gridX${x}Y${y}`)) {
        el.classList.add("miss");
        EnemyTurn();
      }
    }
  }
};
CreateEnemyGrid();
CreatePlayerGrid();
PlaceEnemeyShipsController();
