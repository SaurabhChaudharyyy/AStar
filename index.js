const gridContainer = document.getElementById("gridContainer");

const ROWS = 20;
const COLS = 20;
const TOTAL_CELL = ROWS * COLS;
const gridArray = [];

let startCell = null;
let endCell = null;

class Cell {
    constructor(row,col){
        this.row = row;
        this.col = col;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous = null;
        this.obstacle = false;
        this.element = document.createElement('div');
        this.element.classList.add('cell');
        gridContainer.appendChild(this.element);
        gridArray.push(this);
    }

    addNeighbors(){
        const row = this.row;
        const col = this.col;
        if(row > 0) this.neighbors.push(gridArray[(row - 1)*COLS + col]);
        if(row < ROWS - 1) this.neighbors.push(gridArray[(row + 1)*COLS + col]);
        if(col > 0) this.neighbors.push(gridArray[row*COLS + col - 1]);
        if(col < COLS - 1) this.neighbors.push(gridArray[row * COLS + col + 1]);
    }
}

function generateGrid() {
    // clear gridContainer and gridArray
    gridContainer.innerHTML = '';
    gridArray.length = 0;

    for(let i=0; i<ROWS; i++){
        for(let j=0; j<COLS; j++){
            const cell = new Cell(i,j);
            
            if(i===0 && j === 0) {
                startCell = cell;
                
            }
            if(i === ROWS-1 && j === COLS-1) {
                endCell = cell;
                
            }
    
        }
    }

    
    
    

    for(const cell of gridArray){
        cell.addNeighbors();
    }

    // adding obstacles into grid
    for(const cell of gridArray){
        if(cell !== startCell && cell !== endCell && Math.random() < 0.15){
            cell.obstacle = true;
            cell.element.classList.add('black');
    
        }

    }

    
    // start and end cell are yellow
    startCell.element.classList.add('main');
    endCell.element.classList.add('main');      
}

function heuristic(x,y){
    return Math.sqrt(Math.pow(x.row - y.row, 2) + Math.pow(x.col - y.col, 2));
}

function visualizePath(path){
    for(const cell of gridArray){
        cell.element.classList.remove('path');
    }

    for (const cell of path){
        cell.element.classList.add('path');
    }
    
}


function visualizeSearch(openSet, closedSet){
    for(const cell of openSet) cell.element.classList.add('open');
    for(const cell of closedSet) cell.element.classList.add('close');
}

async function astar(){
    const start = startCell;
    const end = endCell;
    

    const openSet = [];
    const closedSet = [];

    openSet.push(start);

    while (openSet.length > 0){
        let lowestIndex = 0;

        for(let i=0; i < openSet.length; i++){
            if(openSet[i].f < openSet[lowestIndex].f) lowestIndex = i;
        }

        const current = openSet[lowestIndex];
        if(current === end){
            let path = [];
            let temp = current;
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }


            if(path.length > 0) visualizePath(path); 
            else window.prompt("No Path Found");
            
            
            
            return path;
        }

        openSet.splice(lowestIndex, 1);
        closedSet.push(current);
        
        const neighbors = current.neighbors.filter(neighbor => !neighbor.obstacle && !closedSet.includes(neighbor));

        for(let neighbor of neighbors){
            let tempG = current.g + 1;
            let newPath = false;
            if(openSet.includes(neighbor)){
                if(tempG < neighbor.g){
                    neighbor.g = tempG;
                    newPath = true;
                }
            } else {
                neighbor.g = tempG;
                openSet.push(neighbor);
                newPath = true;
            }
            if (newPath){
                neighbor.h = heuristic(neighbor,end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
        
        visualizeSearch(openSet, closedSet);
        await sleep(50);

    }

     return[];   

}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

