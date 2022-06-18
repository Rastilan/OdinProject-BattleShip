// Simple GRID generation
function CreatePlayerGrid() {
    for (let y = 0; y < gridSize.y; y++) {
      for (let x = 0; x < gridSize.x; x++) {
        let gridBox = document.createElement("div");
        gridBox.setAttribute("id", `gridX${x}Y${y}`);
        gridBox.classList.add("grid-box");
  
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

  const GridCreation = {
    CreatePlayerGrid,
    CreateEnemyGrid
  }

  export default GridCreation;