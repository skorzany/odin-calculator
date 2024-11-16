function Calculator(controls, output) {
    this.controls = controls;
    this.output = output;

    this.setDefaultState = () => {
        this.memory = ["",];    //empty string represents the sign
        this.leftNum = 0;
        this.operator = null;
        this.rightNum = 0;
        this.result = 0;
    };

    this.updateDisplay = (memo = [0]) => {this.output.textContent = this.convertToNum(memo)};

    this.convertToNum = (arr) => {
        const answer = Number(arr.join(""));
        return isNaN(answer) ? 0 : answer;
    };

    this.turnOn = () => {
        this.setDefaultState();
        this.updateDisplay();
        this.controls.addEventListener("click", e => {
            const target = e.target;
            const content = target.textContent;
            if (target.matches(".number")) {
                if (content === "0") {
                    if (this.memory.length !== 1) this.memory.push(content);
                }
                else if (content === ".") {
                    if (!(this.memory.includes("."))) this.memory.push(content);
                }
                else if (content === "±") {
                    this.memory[0] = this.memory[0] === "" ? "-" : "";
                }
                else this.memory.push(content);
            }
            this.updateDisplay(this.memory);
        });
    };
};

function main() {
    const controls = document.querySelector(".controls");
    const output = document.querySelector(".output");
    const calc = new Calculator(controls, output);
    calc.turnOn();
};

main();