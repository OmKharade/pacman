const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")
const pacmanFrames = document.getElementById("pacman")
const ghostFrames = document.getElementById("ghost")
let createRect = (x,y,width,height,color) =>{
    canvasContext.fillStyle = color
    canvasContext.fillRect(x,y,width,height)
}
let fps = 30
let blockSize = 20

let wallSpaceWidth = blockSize/1.5
let wallOffset = (blockSize - wallSpaceWidth)/2

const DIRECTION_RIGHT = 4
const DIRECTION_UP = 3
const DIRECTION_LEFT = 2
const DIRECTION_DOWN = 1

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let gameLoop = () => {
    update()
    draw()
}

let update = () => {
    pacman.move()
}

let draw = () => {
    createRect(0,0, canvas.width, canvas.height,"black")
    drawWalls()

    pacman.draw()
}

let gameInterval = setInterval(gameLoop, 1000/fps)

let drawWalls = () => {
    for(let i=0;i<map.length;i++){
        for(let j=0;j<map[0].length;j++){
            if(map[i][j] == 1){ // solid wall
                createRect(j*blockSize, i*blockSize, blockSize, blockSize, "#342DCA")
            }
            // innerWall -> black
            if(j>0 && map[i][j-1]==1){  // right wall
                createRect(j*blockSize, i*blockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, "black")
            } 
            if(j<map[0].length-1 && map[i][j+1] == 1){ // left wall
                createRect(j*blockSize + wallOffset, i*blockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, "black")
            }
            if(i>0 && map[i-1][j]==1){ // top wall
                createRect(j*blockSize + wallOffset, i*blockSize, wallSpaceWidth, wallSpaceWidth + wallOffset, "black")
            } 
            if(i<map.length-1 && map[i+1][j] == 1){ // bottom wall
                createRect(j*blockSize + wallOffset, i*blockSize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, "black")
            }
        }
    }
}

let createNewPacman = () =>{
    pacman = new Player(blockSize,blockSize,blockSize,blockSize,blockSize/5)
}

createNewPacman()
gameLoop()

window.addEventListener("keydown", (e)=>{
    let k = e.key

    setTimeout(()=>{
        if( k=='ArrowLeft' || k=='a' ){
            pacman.nextDirection = DIRECTION_LEFT
        }
        else if( k=='ArrowUp' || k=='w' ){
            pacman.nextDirection = DIRECTION_UP
        }
        else if( k=='ArrowRight' || k=='d' ){
            pacman.nextDirection = DIRECTION_RIGHT
        }
        else if( k=='ArrowDown' || k=='s' ){
            pacman.nextDirection = DIRECTION_DOWN
        }
    },1)
})
