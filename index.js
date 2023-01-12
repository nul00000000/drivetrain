let robotDiv;
let robotX;
let robotY;
let robotDX;
let robotDY;

function onLoad() {
    robotDiv = document.querySelector("#robot");
    window.requestAnimationFrame(loop);
}

function loop() {
    robotDiv.style.top = (Math.random() * 100) + "%";
    robotDiv.style.left = (Math.random() * 100) + "%";
    window.requestAnimationFrame(loop);
}
