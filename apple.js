const ctx = document.querySelector('canvas').getContext('2d');
const backgroundImg = new Image();
backgroundImg.src = './boxes.svg';
const apple = new Image();
apple.src = './apple.svg';
let move;
let snakeArr;
let speed;
let appleLoc;
let direction;
let newDir;

document.querySelector('.gameover-button').innerHTML = "Start Game";

backgroundImg.addEventListener('load', uploadBackground);
document.querySelector('.gameover-button').addEventListener('click', ()=>{
    document.querySelector('.gameover-button').innerHTML = "Game Over";
    document.querySelector('.gameover-cont').style.visibility = 'hidden';
    startGame();
});

//function to make background
function uploadBackground() {
    ctx.clearRect(0,0,500,500)
    const pattern = ctx.createPattern(backgroundImg, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0,0,500, 500);
}

//function to start (restart) game
function startGame() {
    snakeArr = [{
        x: 48,
        y: 16 * 14,
    }, {
        x: 64,
        y: 16 * 14,
    }, {
        x: 80,
        y: 16 * 14, 
    }, {
        x: 96,
        y: 16 * 14,}];

    speed = 100;

    appleLoc = {x: 16 * 18, y: 16*14}
    newDir = undefined;
    direction = '+x';

    //adding user intervension
    document.addEventListener('keydown', (event)=>{
        if (event.key.toLocaleLowerCase() == 'd') {
            if (direction[1] === 'y') {
                newDir = '+x'
            }
        } else if (event.key.toLocaleLowerCase() == 's') {
            if (direction[1] === 'x') {
                newDir = '+y'
            }
        } else if (event.key.toLocaleLowerCase() == 'a') {
            if (direction[1] === 'y') {
                newDir = '-x'
            }
        } else if (event.key.toLocaleLowerCase() == 'w') {
            if (direction[1] === 'x') {
                newDir = '-y'
            }
        } else if (event.key == ' ') {
            console.log('rawr')
            clearTimeout(move)
        }
    });

    game();
}

function game() {
    direction = newDir || direction
    //checking if the snake has crashed
    let touched = false;
    let last = snakeArr[snakeArr.length - 1];
    for (let i = 0; i < snakeArr.length; i++) {
        if (i === snakeArr.length -1) {
            break;
        } 
        if (snakeArr[i].x === last.x && 
            snakeArr[i].y === last.y) {
            touched = true;
            break;
        }
    }
    if (touched) {
        document.querySelector('.gameover-cont').style.visibility = 'visible';
        return ;
    }

    //checking if the snake ate apples
    if (snakeArr[snakeArr.length - 1].x === appleLoc.x &&
        snakeArr[snakeArr.length - 1].y === appleLoc.y) {
        snakeArr.push({
            x: appleLoc.x,
            y: appleLoc.y
        });
        appleLoc.x = Math.floor(Math.random() * 30) * 16;
        appleLoc.y = Math.floor(Math.random() * 30) * 16;
    } 

    //moving the snake
    const tail = snakeArr[snakeArr.length - 1];
    let newTail;
    if (direction[1] == "x"){
        newTail = {
            x: eval(tail.x + direction[0] + 16),
            y: tail.y
        }
    } else if (direction[1] == 'y') {
        newTail = {
            x: tail.x,
            y: eval(tail.y + direction[0] + 16)
        }
    }
    snakeArr.splice(0, 1);
    snakeArr.push(newTail)

    //checking bounderies
    if (snakeArr[snakeArr.length - 1].x > 480 - 16 || 
        snakeArr[snakeArr.length - 1].x < 0 ||
        snakeArr[snakeArr.length - 1].y > 480 - 16 ||
        snakeArr[snakeArr.length - 1].y < 0) {
        document.querySelector('.gameover-cont').style.visibility = 'visible';
        return ;
    }

    //making the background 
    uploadBackground();

    //apples
    ctx.drawImage(apple, appleLoc.x, appleLoc.y);
    

    //drawing the snake
    snakeArr.forEach((particle, i) =>{
        ctx.fillStyle = "green";
        if (i === snakeArr.length - 1) {
            ctx.fillStyle = 'lightgreen';
        }
        ctx.fillRect(particle.x, particle.y, 16, 16);
        ctx.strokeRect(particle.x, particle.y, 16, 16);
    });

    move = setTimeout(game, speed);
}