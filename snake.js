import { renderObjects, uploadBackground } from "./rendering.js";
import { leaders, currState, gameState, ctx, apple } from "./variables.js";

let isSetting = false;
let isLeader = false;

apple.addEventListener('load', uploadBackground);
gameOverListener();

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
            <div class="start-text" style="font-size:15px;text-align:center;">
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
                    <div class="start-text">You Lost!</div>
                    <button class="gameover-button glowbutton">Game Over</button>
                `;
                gameOverListener();
            }
        });
    }

    document.querySelector('.grandchild').innerHTML = `
        <div class="start-text">You Lost!</div>
        <button class="gameover-button glowbutton">Game Over</button>
    `;
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

    renderObjects();

    setTimeout(game, gameState.speed);
}

document.querySelector('.setting-button').addEventListener('click', ()=>{
    if (!isSetting) {
        document.querySelector('.grandchild').innerHTML = `
            <div class="start-text">Settings</div>
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
            <div class="start-text">Start</div>
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
            <div class="start-text">Leaderboard</div>
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
            <div class="start-text">Start</div>
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