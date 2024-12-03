let direction;
let topDistance;
let leftDistance;

runGame()

function runGame() {
    window.addEventListener('keydown', (event)=>{
        if (event.key === "w") {
            direction = 'e';
            topDistance = document.querySelector('.snake-cube').computedStyleMap().get('top').value;
            leftDistance = document.querySelector('.snake-cube').computedStyleMap().get('left').value;
            move();
        }
    });
}

async function move() {
    while (checkBorder(topDistance, leftDistance)) {
        await new Promise((resolve)=> {
            setTimeout(() => {
                document.querySelector('.snake-cube').style.left = `${leftDistance + 10}px`;
                leftDistance += 10;
                resolve();
            }, 100);
        });
    }
}

function checkBorder(topDistance, leftDistance) {
    return (topDistance <= 410) && (0 <= topDistance) && (leftDistance <= 410) && (0 <= leftDistance);
}