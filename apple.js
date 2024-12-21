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
document.querySelector('.suck-text').innerHTML = 'Start!';

backgroundImg.addEventListener('load', uploadBackground);
document.querySelector('.gameover-button').addEventListener('click', ()=>{
    document.querySelector('.gameover-button').innerHTML = "Game Over";
    document.querySelector('.gameover-cont').style.visibility = 'hidden';
    startGame();
});

//function to make background
function uploadBackground() {
    ctx.clearRect(0,0,500,500);

    let head = snakeArr || [{x:240,y:240}];
    head = head[head.length -1];
    const radGrad = ctx.createRadialGradient(head.x+8, head.y+8, 10, 240, 240, 360);
    radGrad.addColorStop(0, "#ffff00");
    radGrad.addColorStop(0.2, "#39FF13");
    radGrad.addColorStop(0.8, "#fe00fe");
    radGrad.addColorStop(1, "#fe00fe");

    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = radGrad;
    ctx.lineWidth = 2;
    for (let i=1;i < 30; i++) {
        ctx.beginPath();
        ctx.moveTo(i*16, 0);
        ctx.lineTo(i*16,480);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 16*i);
        ctx.lineTo(480, i*16);
        ctx.stroke();
    }

    if (appleLoc) {

        const appleGrad = ctx.createRadialGradient(appleLoc.x+8, appleLoc.y+8,2,appleLoc.x+8, appleLoc.y+8, 48);
        appleGrad.addColorStop(0, "rgb(255, 0, 0)");
        appleGrad.addColorStop(0.6, "rgba(255, 7, 7, 0.29)");
        appleGrad.addColorStop(1, "rgba(255, 7, 7, 0)");
        ctx.strokeStyle = appleGrad;
        ctx.fillStyle = appleGrad;

        ctx.beginPath();
        ctx.arc(appleLoc.x+8, appleLoc.y+8, 48, 0, Math.PI*2);
        ctx.fill();

        
        for (let i= -3; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(appleLoc.x - 3*16, appleLoc.y + i*16);
            ctx.lineTo(appleLoc.x + 4 * 16, appleLoc.y + i*16);
            
            ctx.moveTo(appleLoc.x + i*16, appleLoc.y - 3*16);
            ctx.lineTo(appleLoc.x + i*16, appleLoc.y + 4*16);
            ctx.stroke();
        }
        
    }
    

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
        document.querySelector('.suck-text').innerHTML = 'You Lost!';
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
        document.querySelector('.suck-text').innerHTML = 'You Lost!';
        return ;
    }

    //making the background 
    uploadBackground();
    ctx.globalAlpha = 1;

    //apples
    ctx.drawImage(apple, appleLoc.x, appleLoc.y);


    //drawing the snake
    let size = snakeArr.length;
    snakeArr.forEach((particle, i) =>{
        ctx.fillStyle = `rgb(${9+(35*i/size)}, ${9+(210*i/size)}, ${121+(134*i/size)})`;
        ctx.strokeStyle = 'blue';
        ctx.fillRect(particle.x, particle.y, 16, 16);
        // ctx.strokeRect(particle.x, particle.y, 16, 16);
    });

    move = setTimeout(game, speed);
}