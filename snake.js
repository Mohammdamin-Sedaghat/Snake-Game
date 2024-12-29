const ctx = document.querySelector('canvas').getContext('2d');
const backgroundImg = new Image();
backgroundImg.src = './images/boxes.svg';
const apple = new Image();
apple.src = './images/apple.svg';
import { leaders, currState, gameState } from "./variables.js";

let isSetting = false;
let isLeader = false;

document.querySelector('.gameover-button').innerHTML = "Start Game";
document.querySelector('.suck-text').innerHTML = 'Start!';

apple.addEventListener('load', uploadBackground);
gameOverListener()

//function to make background
function uploadBackground() {
    ctx.clearRect(0,0,500,500);

    let head = currState.snakeArr.length === 0 ? [{x:240,y:240}]: currState.snakeArr;
    head = head[head.length -1];
    const radGrad = ctx.createRadialGradient(head.x+8, head.y+8, 10, 240, 240, 360);
    radGrad.addColorStop(0, "#ffff00");
    radGrad.addColorStop(0.2, "#39FF13");
    radGrad.addColorStop(0.8, "#fe00fe");
    radGrad.addColorStop(1, "#fe00fe");

    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = radGrad;
    ctx.lineWidth = 2;
    for (let i=1;i < (480/gameState.boxSize)+1; i++) {
        ctx.beginPath();
        ctx.moveTo(i*gameState.boxSize, 0);
        ctx.lineTo(i*gameState.boxSize,480);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, gameState.boxSize*i);
        ctx.lineTo(480, i*gameState.boxSize);
        ctx.stroke();
    }

    if (gameState.appleLoc.length !== 0) {
        const appleGrad = ctx.createRadialGradient(gameState.appleLoc.x+(gameState.boxSize/2), 
                                                    gameState.appleLoc.y+(gameState.boxSize/2),
                                                    2,
                                                    gameState.appleLoc.x+(gameState.boxSize/2), 
                                                    gameState.appleLoc.y+(gameState.boxSize/2), gameState.boxSize*3);
        appleGrad.addColorStop(0, "rgb(255, 0, 0)");
        appleGrad.addColorStop(0.6, "rgba(255, 7, 7, 0.29)");
        appleGrad.addColorStop(1, "rgba(255, 7, 7, 0)");
        ctx.strokeStyle = appleGrad;
        ctx.fillStyle = appleGrad;

        ctx.beginPath();
        ctx.arc(gameState.appleLoc.x+(gameState.boxSize/2), gameState.appleLoc.y+(gameState.boxSize/2), (gameState.boxSize*3), 0, Math.PI*2);
        ctx.fill();

        
        for (let i= -3; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(gameState.appleLoc.x - 3*gameState.boxSize, gameState.appleLoc.y + i*gameState.boxSize);
            ctx.lineTo(gameState.appleLoc.x + 4 * gameState.boxSize, gameState.appleLoc.y + i*gameState.boxSize);
            
            ctx.moveTo(gameState.appleLoc.x + i*gameState.boxSize, gameState.appleLoc.y - 3*gameState.boxSize);
            ctx.lineTo(gameState.appleLoc.x + i*gameState.boxSize, gameState.appleLoc.y + 4*gameState.boxSize);
            ctx.stroke();
        }
        
    }

    //drawing obstacles
    if (gameState.obstAllowed) {
        gameState.obstacleLoc.forEach((particle)=>{
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "rgb(123, 251, 255)";
            //the circle
            ctx.beginPath();
            ctx.moveTo(particle.x+gameState.boxSize, particle.y+(gameState.boxSize/2));
            ctx.arc(particle.x+(gameState.boxSize/2), particle.y+(gameState.boxSize/2), (gameState.boxSize/2),0, Math.PI*2);
            //the cross
            ctx.moveTo(particle.x+(0.207107*gameState.boxSize), particle.y+(0.207107*gameState.boxSize));
            ctx.lineTo(particle.x+gameState.boxSize-(0.207107*gameState.boxSize), particle.y+gameState.boxSize-(0.207107*gameState.boxSize))
            ctx.moveTo(particle.x+gameState.boxSize-(0.207107*gameState.boxSize), particle.y+(0.207107*gameState.boxSize));
            ctx.lineTo(particle.x+(0.207107*gameState.boxSize), particle.y+gameState.boxSize-(0.207107*gameState.boxSize))
            ctx.stroke();

            //the glow
            ctx.globalAlpha = 0.4;
            const obstGrad = ctx.createRadialGradient(particle.x+(gameState.boxSize/2), 
                                                    particle.y+(gameState.boxSize/2),
                                                    2,
                                                    particle.x+(gameState.boxSize/2), 
                                                    particle.y+(gameState.boxSize/2), gameState.boxSize*3);
            obstGrad.addColorStop(0, "rgb(32, 248, 255)");
            obstGrad.addColorStop(0.6, "rgba(123, 251, 255, 0.64)");
            obstGrad.addColorStop(1, "rgba(0, 120, 124, 0.08)");
            ctx.strokeStyle = obstGrad;
            ctx.fillStyle = obstGrad;

            ctx.beginPath();
            ctx.arc(particle.x+(gameState.boxSize/2), particle.y+(gameState.boxSize/2), (gameState.boxSize*3), 0, Math.PI*2);
            ctx.fill();
        });
    }
    

}

//function to start (restart) game
function startGame() {
    currState.snakeArr = [{
        x: gameState.boxSize*3,
        y: gameState.boxSize * Math.round(480 / (2*gameState.boxSize)),
    }, {
        x: gameState.boxSize*4,
        y: gameState.boxSize * Math.round(480 / (2*gameState.boxSize)),
    }, {
        x: gameState.boxSize*5,
        y: gameState.boxSize * Math.round(480 / (2*gameState.boxSize)), 
    }, {
        x: gameState.boxSize*6,
        y: gameState.boxSize * Math.round(480 / (2*gameState.boxSize))}];

    gameState.appleLoc = {x: gameState.boxSize * Math.round((480*1.4) / (2*gameState.boxSize)), y: gameState.boxSize * Math.round(480 / (2*gameState.boxSize))}
    currState.newDir = undefined;
    currState.direction = '+x';

    //adding user intervension
    document.addEventListener('keydown', (event)=>{
        if (event.key.toLocaleLowerCase() == 'd') {
            if (currState.direction[1] === 'y') {
                currState.newDir = '+x';
            }
        } else if (event.key.toLocaleLowerCase() == 's') {
            if (currState.direction[1] === 'x') {
                currState.newDir = '+y';
            }
        } else if (event.key.toLocaleLowerCase() == 'a') {
            if (currState.direction[1] === 'y') {
                currState.newDir = '-x'
            }
        } else if (event.key.toLocaleLowerCase() == 'w') {
            if (currState.direction[1] === 'x') {
                currState.newDir = '-y'
            }
        }
    });

    game();
}

function loseState() {
    document.querySelector('.gameover-cont').style.visibility = 'visible';

    if (currState.snakeArr.length > leaders[2].score) {
        document.querySelector('.grandchild').innerHTML = `
            <div class="suck-text" style="font-size:15px;text-align:center;">
                Seems like you made it to leaderboard!
            </div>
            <div class="question-cont">
                <div class="question-text">Whats your name?</div>
                <input placeholder="name..." class="question-input">
            </div>
        `; 
        document.querySelector('.question-input').addEventListener('keydown', (event)=>{
            if (event.key === 'Enter') {
                dudeName = document.querySelector('.question-input').value;
                if (currState.snakeArr.length > leaders[0].score) {
                    leaders.splice(0, 0, {names:dudeName, score: currState.snakeArr.length});
                    leaders.pop();
                } else if (currState.snakeArr.length > leaders[1].score) {
                    leaders.splice(1, 0, {names:dudeName, score: currState.snakeArr.length});
                    leaders.pop();
                } else {
                    leaders.splice(2, 0, {names:dudeName, score: currState.snakeArr.length});
                    leaders.pop();
                }
                localStorage.setItem('leaders', JSON.stringify(leaders));

                document.querySelector('.grandchild').innerHTML = `
                    <div class="suck-text">You Lost!</div>
                    <button class="gameover-button glowbutton">Game Over</button>
                `;
                gameOverListener()
            }
        });
    }

    generateObstacles();
}

function game() {
    currState.direction = currState.newDir || currState.direction
    //checking if the snake has crashed
    let touched = false;
    let last = currState.snakeArr[currState.snakeArr.length - 1];
    for (let i = 0; i < currState.snakeArr.length; i++) {
        if (i === currState.snakeArr.length -1) {
            break;
        } 
        if (currState.snakeArr[i].x === last.x && 
            currState.snakeArr[i].y === last.y) {
            touched = true;
            break;
        }
    }
    if (touched) {
        loseState();
        return ;
    }
    gameState.obstacleLoc.forEach((obst)=>{
        if (obst.x === last.x && obst.y === last.y) {
            touched = true;
        }
    });
    if (touched) {
        loseState();
        return ;
    }

    //checking if the snake ate apples
    if (currState.snakeArr[currState.snakeArr.length - 1].x === gameState.appleLoc.x &&
        currState.snakeArr[currState.snakeArr.length - 1].y === gameState.appleLoc.y) {
        currState.snakeArr.push({
            x: gameState.appleLoc.x,
            y: gameState.appleLoc.y
        });
        gameState.appleLoc.x = Math.floor(Math.random() * (480 / gameState.boxSize)) * gameState.boxSize;
        gameState.appleLoc.y = Math.floor(Math.random() * (480 / gameState.boxSize)) * gameState.boxSize;
    } 

    //moving the snake
    const tail = currState.snakeArr[currState.snakeArr.length - 1];
    let newTail;
    if (currState.direction[1] == "x"){
        newTail = {
            x: eval(tail.x + currState.direction[0] + gameState.boxSize),
            y: tail.y
        }
    } else if (currState.direction[1] == 'y') {
        newTail = {
            x: tail.x,
            y: eval(tail.y + currState.direction[0] + gameState.boxSize)
        }
    }
    currState.snakeArr.splice(0, 1);
    currState.snakeArr.push(newTail);

    //checking bounderies
    if (currState.snakeArr[currState.snakeArr.length - 1].x > 480 - gameState.boxSize || 
        currState.snakeArr[currState.snakeArr.length - 1].x < 0 ||
        currState.snakeArr[currState.snakeArr.length - 1].y > 480 - gameState.boxSize ||
        currState.snakeArr[currState.snakeArr.length - 1].y < 0) {
        loseState();
        return ;
    }

    //making the background 
    uploadBackground();
    ctx.globalAlpha = 1;

    //apples
    ctx.drawImage(apple, gameState.appleLoc.x, gameState.appleLoc.y, gameState.boxSize - 1, gameState.boxSize);


    //drawing the snake
    let size = currState.snakeArr.length;
    currState.snakeArr.forEach((particle, i) =>{
        ctx.fillStyle = `rgb(${9+(35*i/size)}, ${9+(210*i/size)}, ${121+(134*i/size)})`;
        ctx.strokeStyle = 'blue';
        ctx.fillRect(particle.x, particle.y, gameState.boxSize, gameState.boxSize);
    });

    setTimeout(game, gameState.speed);
}

document.querySelector('.setting-button').addEventListener('click', ()=>{
    if (!isSetting) {
        document.querySelector('.grandchild').innerHTML = `
            <div class="suck-text">Settings</div>
            <div class="background-size-cont">
                <div>Box Size:</div>
                <input type="range" min="10" max="48" step="2" value=${gameState.boxSize} class="background-size">
                <div>Obstacles:</div>
                <label class="obstacles-label">
                    <input type="checkbox" class="obstacles" ${gameState.obstAllowed ? "checked" : ""}>
                    <span class="slider"></span>
                </label>
                <div>Speed:</div>
                <input type="range" min="10" max="200" step="20" value=${210 - gameState.speed} class="background-size speed-size">
            </div>
        `;
        settingListeners();
    } else {
        document.querySelector('.grandchild').innerHTML = `
            <div class="suck-text">Start</div>
            <button class="gameover-button glowbutton">Start Game</button>
        `;
        gameOverListener();
    }
    isSetting = !isSetting;
    isLeader = false;
});

document.querySelector('.leaderboard-button').addEventListener('click', ()=>{
    if (!isLeader) {
        let totalHTML = ""
        totalHTML += `
            <div class="suck-text">Leaderboard</div>
            <div class="leader-option-cont">
        `
        leaders.forEach((leader)=>{
            totalHTML += `
                <div class='leader-option'>
                    <div>${leader.names}</div>
                    <div>${leader.score}</div>
                </div>
            `
        });
        totalHTML += "</div>";
        document.querySelector('.grandchild').innerHTML = totalHTML;
        isLeader = !isLeader;
        isSetting = false;
    } else {
        document.querySelector('.grandchild').innerHTML = `
            <div class="suck-text">Start</div>
            <button class="gameover-button glowbutton">Start Game</button>
        `;
        gameOverListener();
        isLeader = !isLeader;
        isSetting = false;
    }
});

function gameOverListener() {
    document.querySelector('.gameover-button').addEventListener('click', ()=>{
        document.querySelector('.gameover-button').innerHTML = "Game Over";
        document.querySelector('.gameover-cont').style.visibility = 'hidden';
        startGame();
    });
}

function settingListeners() {
    document.querySelector('.obstacles').addEventListener('change', ()=>{
        gameState.obstAllowed = document.querySelector('.obstacles').checked;
        gameState.obstacleLoc = [];
        generateObstacles();
        uploadBackground();
    });

    document.querySelector('.background-size').addEventListener('change', ()=>{
        let startSize = document.querySelector('.background-size').value
        while (480*5 % startSize != 0) {
            startSize++;
        }
        gameState.boxSize = Number(startSize);
        generateObstacles();
        uploadBackground();
    });

    document.querySelector('.speed-size').addEventListener('change', ()=>{
        gameState.speed = 210 - document.querySelector('.speed-size').value;
    });
}

function generateObstacles() {
    gameState.obstacleLoc = [];
    if (gameState.obstAllowed) {
        for(let i = 0; i < (Math.random()*20)+3; i++) {
            gameState.obstacleLoc.push({
                x:gameState.boxSize*Math.floor(Math.random()*(480 / gameState.boxSize)),
                y: gameState.boxSize*Math.floor(Math.random()*(480 / gameState.boxSize))
            });
        }
    }
}