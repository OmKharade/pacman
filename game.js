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
let score = 0
let ghosts = []
let ghostLocations = [{x:0,y:0},{x:176,y:0},{x:0,y:121},{x:176,y:121},]

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
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
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

let randomTarget = [{x:blockSize,y:blockSize},{x:blockSize,y:(map.length-2)*blockSize},{x:(map[0].length-2)*blockSize,y:blockSize},{x:(map[0].length-2)*blockSize,y:(map.length-2)*blockSize},]

let gameLoop = () => {
    update()
    draw()
}

let update = () => {
    pacman.move()
    pacman.eat()
    for(let i=0;i<ghosts.length;i++){
        ghosts[i].move()
    }
}

let food = () => {
    for(let i=0; i<map.length;i++){
        for(let j=0; j<map[0].length;j++){
            if(map[i][j] == 2){
                createRect(j*blockSize + blockSize/3,i*blockSize + blockSize/3, blockSize/4, blockSize/4, "yellow")
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "20px fantasy"
    canvasContext.fillStyle = "white"
    canvasContext.fillText("Score : " +score,0,blockSize*(map.length+1)+10)
}
let drawGhosts = () => {
    for(let i=0;i<ghosts.length;i++){
        ghosts[i].draw()
    }
}

let draw = () => {
    createRect(0,0, canvas.width, canvas.height,"black")
    drawWalls()
    food()
    pacman.draw()
    drawScore()
    drawGhosts()
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

let createGhosts = () => {
    ghosts = []
    for (let i = 0; i<4; i++){
        let newGhost = new Ghost(9 * blockSize + ( i % 2 == 0? 0:1)*blockSize, 10 * blockSize + ( i % 2 == 0? 0:1)*blockSize, blockSize, blockSize, pacman.speed/2,ghostLocations[i%4].x,ghostLocations[i%4].y,124,116,6+i)
        ghosts.push(newGhost)
    }
}

createNewPacman()
createGhosts()
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
