import _ from 'lodash';
import './style.css';

let root = document.getElementsByTagName('body');
let playerGrid = document.getElementById('player-grid');
let enemyGrid = document.getElementById('enemy-grid');
let playerShips = [];
let enemyShips = [];
let rotation = false;

let gridSize = {
    x: 10,
    y: 10,
    size: 100
}
class ship {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.placed = false;
        this.alive = true;
        this.hit = 0;
    }
}


let carrier = new ship('Carrier', 5);
let battleship = new ship('Battleship', 4);
let destroyer = new ship('Destroyer', 3);
let submarine = new ship('Submarine', 3);
let patrolBoat = new ship('PatrolBoat', 2);
playerShips.push(carrier, battleship,destroyer,submarine,patrolBoat);
enemyShips.push(carrier, battleship,destroyer,submarine,patrolBoat);



function CreatePlayerGrid() {  
    for(let y = 0; y < gridSize.y; y++){
        for(let x = 0; x < gridSize.x; x++) {
            let gridBox = document.createElement('div');
            gridBox.setAttribute('id', `gridX${x}Y${y}`)
            gridBox.classList.add('grid-box');

            playerGrid.insertBefore(gridBox, playerGrid.children[0]);
        }
    }
}

function CreateEnemyGrid() {  
    for(let y = 0; y < gridSize.y; y++){
        for(let x = 0; x < gridSize.x; x++) {
            let gridBox = document.createElement('div');
            gridBox.setAttribute('id', `enemy-gridX${x}Y${y}`)
            gridBox.classList.add('grid-box');
            gridBox.setAttribute('onclick', `Clicked(this, ${x}, ${y})`)
            enemyGrid.insertBefore(gridBox, enemyGrid.children[0]);
        }
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
function PlaceEnemeyShips(){
    enemyShips.forEach(ship => {
        if(ship.placed === true){
            console.log("ship already placed");
        }
        else {
            getRandomInt(2) ? rotation = true : rotation = false;
            let placeX;
            let placeY;
            if(rotation === true){
                placeX = getRandomInt(10);
                placeY = getRandomInt(10-ship.size);
    
            }
            else {
                placeX = getRandomInt(10-ship.size);
                placeY = getRandomInt(10);
            }
            for(let i = 0; i < ship.size; i++){
                if(rotation){
                    for(let b = 0; b < ship.size; b++){
                        if(document.getElementById(`enemy-gridX${placeX}Y${placeY+i}`).classList.contains('placed')){
                            PlaceEnemeyShips();
                            break;
                        }
                    }
                    document.getElementById(`enemy-gridX${placeX}Y${placeY+i}`).classList.add(`${ship.name}`);
                    document.getElementById(`enemy-gridX${placeX}Y${placeY+i}`).classList.add(`placed`);
                }
                else {
                    
                    document.getElementById(`enemy-gridX${placeX+i}Y${placeY}`).classList.add(`${ship.name}`);
                    document.getElementById(`enemy-gridX${placeX}Y${placeY+i}`).classList.add(`placed`);
                }
                
            }
            
    
    
    
            console.log(ship.name, "X: " + placeX, "Y: " + placeY, "Rotated: " + rotation, "Ship Size " + ship.size);
        }
    
    })
     
}

window.Clicked = (el, x, y) => {
    if(el.classList.contains('ship')){
        el.classList.add('hit');
    }
    else { el.classList.add('miss'); }
    
}
CreateEnemyGrid();
CreatePlayerGrid();
PlaceEnemeyShips();