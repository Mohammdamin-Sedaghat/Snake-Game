const ctx = document.querySelector('canvas').getContext('2d');
const img = new Image();
img.src = './boxes.svg';

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
    x: 96,
    y: 48,
}, {
    x: 96,
    y: 96, 
}
];

let speed = 2;

let direction = 'y';


document.addEventListener('keydown', (event)=>{
    if (event.key == 'd') {
        if (direction != 'x') {
            snakeArr[snakeArr.length - 1].y = Math.ceil(snakeArr[snakeArr.length - 1].y / 16) * 16;
            snakeArr.push({
                x: (snakeArr[snakeArr.length - 1].x) + 16,
                y: Math.ceil(snakeArr[snakeArr.length - 1].y / 16) * 16,
            });
            direction = 'x';
            speed = Math.abs(speed);
        }
    } else if (event.key == 's') {
        if (direction === 'x') {
            snakeArr[snakeArr.length - 1].x = Math.ceil(snakeArr[snakeArr.length - 1].x / 16) * 16;
            snakeArr.push({
                y: (snakeArr[snakeArr.length - 1].y) + 16,
                x: Math.ceil(snakeArr[snakeArr.length - 1].x / 16) * 16,
            });
            direction = 'y';
            speed = Math.abs(speed);
        }
    } else if (event.key == 'a') {
        if (direction === 'y') {
            snakeArr[snakeArr.length - 1].y = Math.ceil(snakeArr[snakeArr.length - 1].y / 16) * 16;
            snakeArr.push({
                x: (snakeArr[snakeArr.length - 1].x) - 16,
                y: Math.ceil(snakeArr[snakeArr.length - 1].y / 16) * 16,
            });
            direction = 'x';
            speed = -Math.abs(speed);
            console.log(speed)
        }
    } else if (event.key == 'w') {
        if (direction === 'x') {
            snakeArr[snakeArr.length - 1].x = Math.ceil(snakeArr[snakeArr.length - 1].x / 16) * 16;
            snakeArr.push({
                y: (snakeArr[snakeArr.length - 1].y) - 16,
                x: Math.ceil(snakeArr[snakeArr.length - 1].x / 16) * 16,
            });
            direction = 'y';
            speed = -Math.abs(speed);
        }
    }
})

function game() {
    uploadBackground();
    snakeArr.forEach((particle, i) =>{
        if (i === snakeArr.length - 1) {
            return;
        }
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(particle.x, particle.y, 
            snakeArr[i+1].x - particle.x+16, 
            snakeArr[i+1].y - particle.y+16);
        ctx.fill();
    });

    //moving the tail
    if (snakeArr[0].x == snakeArr[1].x) {
        if (snakeArr[0].y < snakeArr[1].y) {
            snakeArr[0].y += Math.abs(speed)
        } else {
            snakeArr[0].y -= Math.abs(speed)
        }
    } else if (snakeArr[0].y == snakeArr[1].y){
        if (snakeArr[0].x < snakeArr[1].x) {
            snakeArr[0].x += Math.abs(speed)
        } else {
            snakeArr[0].x -= Math.abs(speed)
        }
    }

    if (direction === 'x') {
        snakeArr[snakeArr.length-1].x += speed;
    } else {
        snakeArr[snakeArr.length-1].y += speed;
    }

    if (snakeArr[0].x == snakeArr[1].x &&
        snakeArr[0].y == snakeArr[1].y 
    ) {
        snakeArr.splice(0,1);
    }

    window.requestAnimationFrame(game);
}
img.addEventListener('load', game);