function Calculator(controls, display) {
    this.controls = controls;
    this.display = display;

    this.setDefaultState = function() {
        this.memory = {"signed": false, "contents": []};
        this.processor = [0, null, null];
    };

    this.updateDisplay = function() {
        let output = this.convertToNum(this.memory.contents);
        const lastChar = this.memory.contents[this.memory.contents.length - 1];
        if (lastChar === ",") output += ".";
        this.display.textContent = output;
    };

    this.updateMemory = function(x) {
        this.memory["contents"].push(x);
    };

    this.signMemory = () => {
        this.memory["signed"] = !this.memory["signed"];
    };

    this.floatMemory = () => {
        if (!this.memory["contents"].includes(",")) this.memory.contents.push(",");
    };

    this.convertToNum = function(arr) {
        console.log(this.memory.contents);
        const decimalIdx = arr.indexOf(",");
        let whole = (decimalIdx === -1) ? arr.slice() : arr.slice(0, decimalIdx);
        let fraction = (decimalIdx === -1) ? [] : arr.slice(decimalIdx + 1);

        whole = whole.map((val, idx) => val*10**(whole.length - 1 - idx));
        fraction = fraction.map((val, idx) => val*10**(-idx - 1));
        console.log(whole, fraction);
        return whole.reduce((current, accumulator) => accumulator += current, 0)
            + fraction.reduce((current, accumulator) => accumulator += current, 0);
    };

    this.turnOn = function() {
        this.setDefaultState();
        this.updateDisplay();
        this.controls.addEventListener("click", e => {
            const target = e.target;
            const symbol = target.textContent;
            if (target.matches(".number")) {
                if (!isNaN(symbol)) this.updateMemory(Number(symbol));
                else {
                    if (symbol === "±") this.signMemory();
                    else if (symbol === ",") this.floatMemory();
                }
                this.updateDisplay();
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