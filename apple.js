const ctx = document.querySelector('canvas').getContext('2d');
const img = new Image();
img.src = './boxes.svg';

function uploadBackground() {
    ctx.clearRect(0,0,500,500)
    const pattern = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0,0,500, 500);
}

let particleArray = [{
    x: 48,
    y: 48,
}, {
    x: 96,
    y: 48,
}, {
    x: 96,
    y: 96, 
}
]

function game() {
    uploadBackground();
    particleArray.forEach((particle, i) =>{
        if (i === 2) {
            return;
        }
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(particle.x, particle.y, 
            particleArray[i+1].x - particle.x+16, 
            particleArray[i+1].y - particle.y+16);
        ctx.fill();
    });

    // window.requestAnimationFrame(game);
}

img.addEventListener('load', game);