function Calculator(controls, output) {
    this.MAXLENGTH = 10;
    this.controls = controls;
    this.output = output;
    this.memory = [];

    this.updateDisplay = () => {
        if (this.memory.length === 0) this.output.textContent = 0;
        else if (this.MAXLENGTH < this.memory.length) this.output.textContent = `...${this.memory.slice(this.memory.length - this.MAXLENGTH).join("")}`;
        else this.output.textContent = this.memory.join("");
    };

    this.updateMemory = (x) => {
        this.memory.push(x);
        this.updateDisplay();
    };

    this.turnOn = function () {
        this.updateDisplay();
        this.controls.addEventListener("click", e => {
            const target = e.target;
            if (target.classList.contains("circle")) this.updateMemory(target.textContent);
        })
    }
};

function main() {
    const controls = document.querySelector(".controls");
    const output = document.querySelector(".output");
    const calculator = new Calculator(controls, output);
    calculator.turnOn();
}

main();