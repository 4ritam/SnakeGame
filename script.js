let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

canvas.height = 400;
canvas.width = 500;

let delta = 0.5;

let blockSize = 10;

let loopTime = 1;

let snakeLengthInit = 5;

let snakeBlocks = [];

let isMoving = false;

let execution;

let fruitX = 0;
let fruitY = 0;
let fruitRadius = 6;

let needFruit = true;


let playing;

let start = document.getElementById('start');

let score = 0;
let scoreboard = document.getElementById('score');





class Snake {
    constructor(x, y, dx, dy, size){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
    }

    draw = () => {
        ctx.beginPath();
        ctx.fillRect(this.x,this.y,this.size,this.size);
        ctx.closePath();
    }
}

let newBlock = new Snake(0,0,0,0,0);

let snakeInit = (initx, inity, size, snakes) => {
    for(let i = 0; i<snakes; i++){
        snakeBlocks.push(new Snake(initx - (i*size),inity,delta, 0, size));
    }
}

let fruitRandomiser = () => {
    if(!needFruit) return;
    fruitX = Math.floor(Math.random() * (canvas.width - blockSize));
    fruitY = Math.floor(Math.random() * (canvas.height - blockSize));
    snakeBlocks.forEach(block => {
        if((fruitX + blockSize > block.x && fruitX < block.x + blockSize) && (fruitY + blockSize > block.y && fruitY < block.y + blockSize)) return;
    });
    needFruit = false;
    
}


let addFruit = () => {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(fruitX + blockSize/2, fruitY + blockSize/2, fruitRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = 'black';
}

let drawSnakes = (snakeB) =>{
    for(let snakeblocks of snakeB){
        snakeblocks.draw();
    }
}


let moving = (snakeB)=>{
    for(let snakeblocks of snakeB){
        snakeblocks.x += snakeblocks.dx;
        snakeblocks.y += snakeblocks.dy;
    }
}

let movement = (e) => {
    if(e.key === 'w'){
        if(snakeBlocks[0].dy === delta) return;
    }
    if(e.key === 'a'){
        if(snakeBlocks[0].dx === delta) return;
    }
    if(e.key === 's'){
        if(snakeBlocks[0].dy === -delta) return;
    }
    if(e.key === 'd'){
        if(snakeBlocks[0].dx === -delta) return;
    }
    isMoving = true;
    ifMoving(e.key, 0);
}


let ifMoving = (key, numb) => {
    let count = numb;
    if(count === snakeBlocks.length) return;
    if(key === 'w'){
        snakeBlocks[count].dx = 0;
        snakeBlocks[count].dy = -delta;
    }
    if(key === 'a'){
        snakeBlocks[count].dx = -delta;
        snakeBlocks[count].dy = 0;
    }
    if(key === 's'){
        snakeBlocks[count].dx = 0;
        snakeBlocks[count].dy = delta;
    }
    if(key === 'd'){
        snakeBlocks[count].dx = delta;
        snakeBlocks[count].dy = 0;
    }
    count++;
    execution = setTimeout(()=>{
        ifMoving(key,count)
    }, 40*(1/delta));
}

let borderCheck = (block) => {
    for(let i=3; i<block.length; i++){
        if(
            (block[0].x < block[i].x + blockSize && block[0].x + blockSize> block[i].x)&&
            (block[0].y < block[i].y + blockSize && block[0].y + blockSize> block[i].y)
        ){
            clearInterval(playing);
            alert('You Lost');
        }
    }
    if(
        !(
            block[0].x < 0 || block[0].x > canvas.width - blockSize ||
            block[0].y < 0 || block[0].y > canvas.height - blockSize
        )
    ) return;
    clearInterval(playing);
    alert('You Lost');
}


let collisionCheck = () => {
    if(
        (
            snakeBlocks[0].x + blockSize > fruitX &&
            snakeBlocks[0].x < fruitX + fruitRadius*2
        ) && 
        (
            snakeBlocks[0].y < fruitY + fruitRadius*2 &&
            snakeBlocks[0].y + blockSize > fruitY
        )
    ){ 
        newBlock.x = snakeBlocks[snakeBlocks.length -1].x;
        newBlock.y = snakeBlocks[snakeBlocks.length -1].y;
        newBlock.dx = snakeBlocks[snakeBlocks.length -1].dx;
        newBlock.dy = snakeBlocks[snakeBlocks.length -1].dy;
        needFruit = true;
        setTimeout(()=>{
            snakeBlocks.push(new Snake(newBlock.x, newBlock.y, newBlock.dx, newBlock.dy, blockSize));
        }, 40*(1/delta))
        delta = delta+0.025;
        score += 10;
    }
}


let scoreCheck = ()=>{
    scoreboard.innerHTML = `Score : ${score}`;
}


let draw = ()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    fruitRandomiser();
    addFruit();
    drawSnakes(snakeBlocks);
    moving(snakeBlocks);
    borderCheck(snakeBlocks);
    collisionCheck();
    scoreCheck();
}

snakeInit(250,200, blockSize, snakeLengthInit);

start.addEventListener('click', () =>{
    playing = setInterval(draw, 1);
})

window.addEventListener('keyup', movement);
