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
let isSetting = false;
let boxSize = 16;

document.querySelector('.gameover-button').innerHTML = "Start Game";
document.querySelector('.suck-text').innerHTML = 'Start!';

apple.addEventListener('load', uploadBackground);
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
    for (let i=1;i < (480/boxSize)+1; i++) {
        ctx.beginPath();
        ctx.moveTo(i*boxSize, 0);
        ctx.lineTo(i*boxSize,480);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, boxSize*i);
        ctx.lineTo(480, i*boxSize);
        ctx.stroke();
    }

    if (appleLoc) {

        const appleGrad = ctx.createRadialGradient(appleLoc.x+(boxSize/2), 
                                                    appleLoc.y+(boxSize/2),
                                                    2,
                                                    appleLoc.x+(boxSize/2), 
                                                    appleLoc.y+(boxSize/2), boxSize*3);
        appleGrad.addColorStop(0, "rgb(255, 0, 0)");
        appleGrad.addColorStop(0.6, "rgba(255, 7, 7, 0.29)");
        appleGrad.addColorStop(1, "rgba(255, 7, 7, 0)");
        ctx.strokeStyle = appleGrad;
        ctx.fillStyle = appleGrad;

        ctx.beginPath();
        ctx.arc(appleLoc.x+(boxSize/2), appleLoc.y+(boxSize/2), (boxSize*3), 0, Math.PI*2);
        ctx.fill();

        
        for (let i= -3; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(appleLoc.x - 3*boxSize, appleLoc.y + i*boxSize);
            ctx.lineTo(appleLoc.x + 4 * boxSize, appleLoc.y + i*boxSize);
            
            ctx.moveTo(appleLoc.x + i*boxSize, appleLoc.y - 3*boxSize);
            ctx.lineTo(appleLoc.x + i*boxSize, appleLoc.y + 4*boxSize);
            ctx.stroke();
        }
        
    }
    

}

//function to start (restart) game
function startGame() {
    snakeArr = [{
        x: boxSize*3,
        y: boxSize * Math.round(480 / (2*boxSize)),
    }, {
        x: boxSize*4,
        y: boxSize * Math.round(480 / (2*boxSize)),
    }, {
        x: boxSize*5,
        y: boxSize * Math.round(480 / (2*boxSize)), 
    }, {
        x: boxSize*6,
        y: boxSize * Math.round(480 / (2*boxSize))}];

    speed = 100;

    appleLoc = {x: boxSize * Math.round((480*1.4) / (2*boxSize)), y: boxSize * Math.round(480 / (2*boxSize))}
    // apple.height = boxSize;
    // apple.width = boxSize;
    newDir = undefined;
    direction = '+x';

    //adding user intervension
    document.addEventListener('keydown', (event)=>{
        if (event.key.toLocaleLowerCase() == 'd') {
            if (direction[1] === 'y') {
                newDir = '+x';
            }
        } else if (event.key.toLocaleLowerCase() == 's') {
            if (direction[1] === 'x') {
                newDir = '+y';
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
        appleLoc.x = Math.floor(Math.random() * (480 / boxSize)) * boxSize;
        appleLoc.y = Math.floor(Math.random() * (480 / boxSize)) * boxSize;
    } 

    //moving the snake
    const tail = snakeArr[snakeArr.length - 1];
    let newTail;
    if (direction[1] == "x"){
        newTail = {
            x: eval(tail.x + direction[0] + boxSize),
            y: tail.y
        }
    } else if (direction[1] == 'y') {
        newTail = {
            x: tail.x,
            y: eval(tail.y + direction[0] + boxSize)
        }
    }
    snakeArr.splice(0, 1);
    snakeArr.push(newTail)

    //checking bounderies
    if (snakeArr[snakeArr.length - 1].x > 480 - boxSize || 
        snakeArr[snakeArr.length - 1].x < 0 ||
        snakeArr[snakeArr.length - 1].y > 480 - boxSize ||
        snakeArr[snakeArr.length - 1].y < 0) {
        document.querySelector('.gameover-cont').style.visibility = 'visible';
        document.querySelector('.suck-text').innerHTML = 'You Lost!';
        return ;
    }

    //making the background 
    uploadBackground();
    ctx.globalAlpha = 1;

    //apples
    ctx.drawImage(apple, appleLoc.x, appleLoc.y, boxSize - 1, boxSize);


    //drawing the snake
    let size = snakeArr.length;
    snakeArr.forEach((particle, i) =>{
        ctx.fillStyle = `rgb(${9+(35*i/size)}, ${9+(210*i/size)}, ${121+(134*i/size)})`;
        ctx.strokeStyle = 'blue';
        ctx.fillRect(particle.x, particle.y, boxSize, boxSize);
    });

    move = setTimeout(game, speed);
}

document.querySelector('.setting-button').addEventListener('click', ()=>{
    if (!isSetting) {
        document.querySelector('.grandchild').innerHTML = `
            <div class="suck-text">Settings</div>
            <div class="background-size-cont">
                <div>Box Size:</div>
                <input type="range" min="10" max="48" step="2" value=${boxSize} class="background-size">
                <div>Obstacles:</div>
                <label class="obstacles-label">
                    <input type="checkbox" class="obstacles" checked=${obstAllowed}>
                    <span class="slider"></span>
                </label>
            </div>
        `;
        insertListeners();
    } else {
        document.querySelector('.grandchild').innerHTML = `
            <div class="suck-text">Start</div>
            <button class="gameover-button glowbutton">Start Game</button>
        `;
        document.querySelector('.gameover-button').addEventListener('click', ()=>{
            document.querySelector('.gameover-button').innerHTML = "Game Over";
            document.querySelector('.gameover-cont').style.visibility = 'hidden';
            startGame();
        });
    }
    isSetting = !isSetting;
});

let obstAllowed = false;

function insertListeners() {
    document.querySelector('.slider').addEventListener('click', ()=>{
        obstAllowed = document.querySelector('.obstacles').checked
        console.log(obstAllowed);
    });

    document.querySelector('.background-size').addEventListener('change', ()=>{
        boxSize = Math.round(480 / (480 / document.querySelector('.background-size').value));
        uploadBackground();
    });
}