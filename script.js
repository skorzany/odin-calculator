function updateDisplay(display, input) {
    display.textContent = input;
}

const controls = document.querySelector(".controls");
const display = document.querySelector(".output");
controls.addEventListener("click", e => {
    let target = e.target;
    if (target.classList.contains("circle")) updateDisplay(display, target.textContent);
});