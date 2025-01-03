// import { gameOverListener, starterListeners } from "./listners.js";
import { renderObjects, uploadBackground, generateObstacles } from "./rendering.js";
import { leaders, currState, gameState, apple } from "./variables.js";
let isSetting = false;
let isLeader = false;
let move;
starterListeners();
gameOverListener();

//function to start (restart) game
function startGame() {
    //setting the location of snake
    currState.snakeArr = [];
    for(let i= 3; i < 7; i++) {
        currState.snakeArr.push(
            {
                x: gameState.boxSize*i,
                y: gameState.boxSize * Math.round(480 / (2*gameState.boxSize)),
            } 
        )
    }
    //putting apple In correct place. 
    gameState.appleLoc = {x: gameState.boxSize * Math.round((480*1.4) / (2*gameState.boxSize)), y: gameState.boxSize * Math.round(480 / (2*gameState.boxSize))}
    //making sure the direction is correct
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
    //start the game!
    game();
}

function loseState() {
    clearTimeout(move);
    //bringing back the gameover container
    document.querySelector('.gameover-cont').style.visibility = 'visible';
    document.querySelector('.grandchild').innerHTML = `
        <div class="start-text">You Lost!</div>
        <button class="gameover-button glowbutton">Game Over</button>
    `;
    gameOverListener();

    //checking if user should be on leaderboard
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
            //putting the user in correct place
            if (event.key === 'Enter') {
                const dudeName = document.querySelector('.question-input').value;
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
                //saving the leaders
                localStorage.setItem('leaders', JSON.stringify(leaders));

                document.querySelector('.grandchild').innerHTML = `
                    <div class="start-text">You Lost!</div>
                    <button class="gameover-button glowbutton">Game Over</button>
                `;
                gameOverListener();
            }
        });
    }

    generateObstacles();
}

function game() {
    //getting direction
    currState.direction = currState.newDir || currState.direction
    //getting the snake's head
    let head = currState.snakeArr[currState.snakeArr.length - 1];
    //checking if the snake has crashed
    for (let i = 0; i < currState.snakeArr.length - 1; i++) {
        if (currState.snakeArr[i].x === head.x && 
            currState.snakeArr[i].y === head.y) {
            touched = true;
            return loseState();
        }
    }
    let touched = false;
    gameState.obstacleLoc.forEach((obst)=>{
        if (obst.x === head.x && obst.y === head.y) {
            touched = true;
        }
    });
    if (touched) return loseState();

    //checking if the snake ate apples
    if (head.x === gameState.appleLoc.x && head.y === gameState.appleLoc.y) {
        //increasing size
        currState.snakeArr.push({ x: gameState.appleLoc.x, y: gameState.appleLoc.y });
        //generatign new snake
        gameState.appleLoc.x = Math.floor(Math.random() * (480 / gameState.boxSize)) * gameState.boxSize;
        gameState.appleLoc.y = Math.floor(Math.random() * (480 / gameState.boxSize)) * gameState.boxSize;
    } 

    //moving the snake
    let newHead;
    if (currState.direction[1] == "x"){
        newHead = {
            x: eval(head.x + currState.direction[0] + gameState.boxSize),
            y: head.y
        }
    } else if (currState.direction[1] == 'y') {
        newHead = {
            x: head.x,
            y: eval(head.y + currState.direction[0] + gameState.boxSize)
        }
    }
    currState.snakeArr.splice(0, 1);
    head = newHead;
    currState.snakeArr.push(newHead);

    //checking bounderies
    if (head.x > 480 - gameState.boxSize || head.x < 0 ||
        head.y > 480 - gameState.boxSize || head.y < 0) {
        return loseState();
    }

    //making the background 
    uploadBackground();
    //rendering the objects
    renderObjects();

    move = setTimeout(game, gameState.speed);
}

function starterListeners() {
    apple.addEventListener('load', uploadBackground);

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

function gameOverListener() {
    document.querySelector('.gameover-button').addEventListener('click', ()=>{
        document.querySelector('.gameover-button').innerHTML = "Game Over";
        document.querySelector('.gameover-cont').style.visibility = 'hidden';
        startGame();
    });
}