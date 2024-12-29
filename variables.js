export let gameState = {
    speed: 100,
    appleLoc: [],
    obstAllowed: false,
    obstacleLoc: [],
    boxSize: 16,
}
export let currState = {
    direction: "+x",
    newDir: "+x",
    snakeArr: [],
}
export let leaders = JSON.parse(localStorage.getItem('leaders')) || [
    {names:"Not Set", score:0},
    {names:"Not Set", score:0},
    {names:"Not Set", score:0},
]