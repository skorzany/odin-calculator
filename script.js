function Calculator(controls, output) {
    this.controls = controls;
    this.output = output;

    this.memory = 0;
    this.leftNum = 0;
    this.operator = null;
    this.rightNum = null;
}

function main() {
    const controls = document.querySelector(".controls");
    const output = document.querySelector(".output")
    const calc = new Calculator(controls, output);
    calc.turnOn();
}