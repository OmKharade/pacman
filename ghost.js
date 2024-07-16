class Ghost{
    constructor(x , y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.direction = DIRECTION_RIGHT
        this.imageX = imageX
        this.imageY = imageY
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight
        this.range = range
        this.randomTargetIndex = parseInt(Math.random() * 4)
        this.target = randomTarget[this.randomTargetIndex]
        setInterval(()=>{
            this.changeRandomDirection()
        },10000)
    }

    changeRandomDirection(){
        this.randomTargetIndex += 1
        this.randomTargetIndex = this.randomTargetIndex % 4
    }

    isInRangeOfPacman(){
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX())
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY())
        if(Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range){
            return true
        }
        return false
    }

    move(){
        if(this.isInRangeOfPacman()){
            this.target = pacman
        }
        else{
            this.target = randomTarget[this.randomTargetIndex]
        }
        this.changeDirectionIfPossible()
        this.moveForwards()
        if(this.checkCollision()){
            this.moveBackwards()
            return
        }
    }
    moveBackwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x -= this.speed
                break
            case DIRECTION_UP:
                this.y += this.speed
                break
            case DIRECTION_LEFT:
                this.x += this.speed
                break
            case DIRECTION_DOWN:
                this.y -= this.speed
                break
        }
    }
    moveForwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x += this.speed
                break
            case DIRECTION_UP:
                this.y -= this.speed
                break
            case DIRECTION_LEFT:
                this.x -= this.speed
                break
            case DIRECTION_DOWN:
                this.y += this.speed
                break
        }
    }
    checkCollision(){
        if(
            map[this.getMapY()][this.getMapX()] == 1      ||
            map[this.getRightMapY()][this.getMapX()] == 1 ||
            map[this.getMapY()][this.getRightMapX()] == 1 ||
            map[this.getRightMapY()][this.getRightMapX()] == 1
            ){
                return true
            }
        return false
    }


    changeDirectionIfPossible(){
        let tempDirection = this.direction

        this.direction = this.calculateNewDirection(map, parseInt(this.target.x / blockSize),parseInt(this.target.y / blockSize))

        if(typeof this.direction === "undefined"){
            this.direction = tempDirection
            return
        }
        if (
            this.getMapY() != this.getRightMapY() &&
            (this.direction == DIRECTION_LEFT ||
                this.direction == DIRECTION_RIGHT)
        ) {
            this.direction = DIRECTION_UP;
        }
        if (
            this.getMapX() != this.getRightMapX() &&
            this.direction == DIRECTION_UP
        ) {
            this.direction = DIRECTION_LEFT;
        }

        this.moveForwards()
        if(this.checkCollision()){
            this.moveBackwards()
            this.direction = tempDirection
        }
        else{
            this.moveBackwards()
        }
    }

    calculateNewDirection(map, destX, destY){
        let mp = []
        for(let i=0; i<map.length;i++){
            mp[i] = map[i].slice()
        }
        let queue = [
            {
                x:this.getMapX(),
                y:this.getMapY(),
                moves: []
            }
        ]
        while(queue.length > 0){
            let popped = queue.shift()
            if(popped.x == destX && popped.y == destY){
                return popped.moves[0]
            }
            else{
                mp[popped.y][popped.x] = 1
                let neighborList = this.addNeighbors(popped,mp)
                for(let i=0;i<neighborList.length;i++){
                    queue.push(neighborList[i])
                }
            }
        }
        return 1
    }

    addNeighbors(popped, mp){
        let queue = []
        let numOfRows = mp.length
        let numOfColumns = mp[0].length

        if(popped.x -1 >= 0 && popped.x -1 < numOfRows &&
            mp[popped.y][popped.x-1] != 1){
                let tempMoves = popped.moves.slice()
                tempMoves.push(DIRECTION_LEFT)
                queue.push({x: popped.x - 1, y: popped.y, moves: tempMoves})
            }
        if(popped.x +1 >= 0 && popped.x +1 < numOfRows &&
            mp[popped.y][popped.x+1] != 1){
                let tempMoves = popped.moves.slice()
                tempMoves.push(DIRECTION_RIGHT)
                queue.push({x: popped.x + 1, y: popped.y, moves: tempMoves})
            }
        if(popped.y -1 >= 0 && popped.y -1 < numOfRows&&
            mp[popped.y-1][popped.x] != 1){
                let tempMoves = popped.moves.slice()
                tempMoves.push(DIRECTION_UP)
                queue.push({x: popped.x, y: popped.y - 1, moves: tempMoves})
            }
        if(popped.y +1 >= 0 && popped.y +1 < numOfRows &&
            mp[popped.y+1][popped.x] != 1){
                let tempMoves = popped.moves.slice()
                tempMoves.push(DIRECTION_DOWN)
                queue.push({x: popped.x, y: popped.y + 1, moves: tempMoves})
            }
        
            return queue
    }

    changeAnimation(){
        this.currentFrame = this.currentFrame == this.frameCount ? 1: this.currentFrame+1
    }
    draw(){
        canvasContext.save()
        canvasContext.drawImage(ghostFrames,this.imageX,this.imageY,this.imageWidth,this.imageHeight,this.x,this.y,this.width,this.height)
        canvasContext.restore()
    }
    getMapX(){
        return parseInt(this.x/blockSize)
    }
    getMapY(){
        return parseInt(this.y/blockSize)
    }
    getRightMapX(){
        return parseInt((this.x + 0.9999 * blockSize)/blockSize)
    }
    getRightMapY(){
        return parseInt((this.y + 0.9999 * blockSize)/blockSize)
    }
}
let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].move();
    }
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};