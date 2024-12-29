import { ctx, currState, gameState, apple } from "./variables.js";

//function to make background
export function uploadBackground() {
    //clearing the place
    ctx.clearRect(0,0,500,500);
    //adding glow to the head of snake
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
    //drawing the boxes
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

    //adding the glow to the apple
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
            //adding the glow to lines
            ctx.beginPath();
            ctx.moveTo(gameState.appleLoc.x - 3*gameState.boxSize, gameState.appleLoc.y + i*gameState.boxSize);
            ctx.lineTo(gameState.appleLoc.x + 4 * gameState.boxSize, gameState.appleLoc.y + i*gameState.boxSize);
            
            //adding the mist effect
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

export function renderObjects() {
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
}