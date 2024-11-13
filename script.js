function Calculator(controls, display) {
    this.controls = controls;
    this.display = display;

    this.setDefaultState = function() {
        this.memory = ["",];        // empty string reserved for sign
        this.processor = [0, null, null];
    };

    // this.updateDisplay = function() {
    //     if (this.memory.length === 1)
    // };

    this.updateMemory = function(x) {
        this.memory.push(x);
    };

    this.signMemory = () => {
        this.memory[0] = (this.memory[0]) ? "" : "-";
    };

    this.floatMemory = () => {
        if (!this.memory.includes(".")) this.memory.push(".");
    };

    this.turnOn = function() {
        this.setDefaultState();
        this.updateDisplay();
        this.controls.addEventListener("click", e => {
            const target = e.target;
            const symbol = target.textContent;
            if (target.matches(".number")) {
                if (!isNaN(symbol)) this.updateMemory(symbol);
                else {
                    if (symbol === "±") this.signMemory();
                    else if (symbol === ",") this.floatMemory();
                }
            }
        });
    };
};

function main() {
    const controls = document.querySelector(".controls");
    const display = document.querySelector(".output");

    const calc = new Calculator(controls, display);
    calc.turnOn();
};


main();