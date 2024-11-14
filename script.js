function Calculator(controls, display) {
    this.controls = controls;
    this.display = display;
    this.SCREENLENGTH = 14;    // max number of digits that fit on the screen 

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
    // todo: add a new function for converting memory to proper number
    // add displayResult() which will be called after an operator was pressed and change display to proper result stored in processor[0]
    this.viewMemory = function() {
        let s = this.memory.contents.join("");
        s = s.replace(/^0+/, "");   // remove leading zeros
        s = (s === "") ? "0" : s;
        if (s[0] === ".") s = "0" + s;
        if (this.SCREENLENGTH < s.length) s = "..." + s.substring(s.length - this.SCREENLENGTH);
        if (this.memory.signed) s = "-" + s;
        this.display.textContent = s;
    };

    this.updateMemory = function(x) {
        this.memory["contents"].push(x);
    };

    this.signMemory = () => {
        this.memory["signed"] = !this.memory["signed"];
    };

    this.floatMemory = () => {
        if (!this.memory["contents"].includes(".")) this.memory.contents.push(".");
    };

    this.convertToNum = function(arr) {
        console.log(this.memory.contents);
        const decimalIdx = arr.indexOf(".");
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
        this.viewMemory();
        this.controls.addEventListener("click", e => {
            const target = e.target;
            const symbol = target.textContent;
            if (target.matches(".number")) {
                if (!isNaN(symbol)) this.updateMemory(Number(symbol));
                else {
                    if (symbol === "±") this.signMemory();
                    else if (symbol === ",") this.floatMemory();
                }
                this.viewMemory();
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