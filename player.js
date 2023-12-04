class Player{
    constructor(x , y, width, height, speed){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.direction = DIRECTION_RIGHT
        this.currentFrame = 1
        this.frameCount = 7

        setInterval(() =>{
            this.changeAnimation()
        },100)
    }

    move(){
        //this.changeDirectionIfPossible()
        this.moveForwards()
        if(this.checkCollision()){
            this.moveBackwards()
        }
    }
    eat(){
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
    checkGhostCollision(){
    }
    changeDirection(){
    }
    changeDirectionIfPossible(){
    }
    changeAnimation(){
        this.currentFrame = this.currentFrame == this.frameCount ? 1: this.currentFrame+1
    }
    draw(){
        canvasContext.save()
        canvasContext.translate(this.x + blockSize/2, this.y + blockSize/2)
        canvasContext.rotate((this.direction*90*Math.PI)/180)
        canvasContext.translate(-this.x - blockSize/2, -this.y - blockSize/2)
        canvasContext.drawImage(pacmanFrames,(this.currentFrame-1)*blockSize,0,blockSize,blockSize,this.x,this.y,this.width,this.height)
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