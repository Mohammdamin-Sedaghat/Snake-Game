const ctx = document.querySelector('canvas').getContext('2d');
const img = new Image();
img.src = './boxes.svg';
const apple = new Image();
apple.src = './apple.svg';
let move;

function uploadBackground() {
    ctx.clearRect(0,0,500,500)
    const pattern = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0,0,500, 500);
}

let snakeArr = [{
    x: 48,
    y: 48,
}, {
    x: 64,
    y: 48,
}, {
    x: 80,
    y: 48, 
}, {
    x: 96,
    y: 48, 
}];

let speed = 100;

let appleLoc = {
    x: 112,
    y: 112
}

let direction = '+x';

//adding user intervension
document.addEventListener('keydown', (event)=>{
    if (event.key.toLocaleLowerCase() == 'd') {
        if (direction[1] === 'y') {
            direction = '+x'
        }
    } else if (event.key.toLocaleLowerCase() == 's') {
        if (direction[1] === 'x') {
            direction = '+y'
        }
    } else if (event.key.toLocaleLowerCase() == 'a') {
        if (direction[1] === 'y') {
            direction = '-x'
        }
    } else if (event.key.toLocaleLowerCase() == 'w') {
        if (direction[1] === 'x') {
            direction = '-y'
        }
    } else if (event.key == ' ') {
        console.log('rawr')
        clearTimeout(move)
    }
});

function game() {
    //checking bounderies
    if (snakeArr[snakeArr.length - 1].x > 481 || 
        snakeArr[snakeArr.length - 1].x < 0 ||
        snakeArr[snakeArr.length - 1].y > 481 ||
        snakeArr[snakeArr.length - 1].y < 0) {
        return ;
    }

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
        return ;
    }

    if (snakeArr[snakeArr.length - 1].x === appleLoc.x &&
        snakeArr[snakeArr.length - 1].y === appleLoc.y) {
        snakeArr.push({
            x: appleLoc.x,
            y: appleLoc.y
        });
        appleLoc.x = Math.floor(Math.random() * 30) * 16;
        appleLoc.y = Math.floor(Math.random() * 30) * 16;
    } 
    //making the background 
    uploadBackground();
    //moving the snake
    snakeArr.forEach((particle, i) =>{
        if (i == snakeArr.length - 1) {
            if (direction[1] == "x"){
                particle.x = eval(particle.x + direction[0] + 16);
            } else {
                particle.y = eval(particle.y + direction[0] + 16);
            }
            return ;
        }
        particle.x = snakeArr[i+1].x;
        particle.y = snakeArr[i+1].y;
    });

    //apples
    ctx.drawImage(apple, appleLoc.x, appleLoc.y);
    

    //drawing the snake
    snakeArr.forEach((particle) =>{
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(particle.x, particle.y, 16, 16);
        ctx.fill();
    });

    move = setTimeout(game, speed);
}
img.addEventListener('load', game);