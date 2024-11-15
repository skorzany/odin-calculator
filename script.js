function Calculator(controls, display) {
    this.SCREENLENGTH = 14;    // max number of digits that fit on the screen
    this.controls = controls;
    this.display = display;

    this.setDefaultState = () => {
        this.processor = [null, null, null];    // [x, operator, y]
        this.resetMemory();
        this.showResult();
    };

    this.showResult = () => {
        const result = this.processor[0] ?? 0;
        this.display.textContent = result;
    };

    this.doTheMath = () => {
        let [x, op, y] = [...this.processor];
        let result = (function () {
            switch (op) {
                case "+": return x + y;
                case "−": return x - y;
                case "×": return x*y;
                case "÷": return x/y;
            }
        })();
        // console.log(`I did ${x} ${op} ${y}`);
        result = result ?? x;
        console.log(result);
        this.processor[0] = result;
        this.processor[2] = null;
    };

    this.viewMemory = () => {
        let s = this.memory.contents.join("");
        s = s.replace(/^0+/, "");   // remove leading zeros
        s = (s === "") ? "0" : s;
        if (s[0] === ".") s = "0" + s;
        if (this.SCREENLENGTH < s.length) s = "..." + s.substring(s.length - this.SCREENLENGTH);
        if (this.memory.signed) s = "-" + s;
        this.display.textContent = s;
    };

    this.resetMemory = () => {
        this.memory = {"signed": false, "contents": []};
    }
    this.updateMemory = (x) => {
        this.memory.contents.push(x);
    };

    this.signMemory = () => {
        this.memory.signed = !this.memory.signed;
    };

    this.floatMemory = () => {
        if (!this.memory.contents.includes(".")) this.memory.contents.push(".");
    };

    this.undoMemory = () => {
        this.memory.contents.pop();
    };

    this.convertToNum = (obj) => {
        const sign = obj.signed ? -1 : 1;
        const arr = obj.contents;
        const decimalIdx = arr.indexOf(".");
        let whole = (decimalIdx === -1) ? arr.slice() : arr.slice(0, decimalIdx);
        let fraction = (decimalIdx === -1) ? [] : arr.slice(decimalIdx + 1);

        whole = whole.map((val, idx) => val*10**(whole.length - 1 - idx));
        fraction = fraction.map((val, idx) => val*10**(-idx - 1));

        return sign*(whole.reduce((current, accumulator) => accumulator += current, 0)
            + fraction.reduce((current, accumulator) => accumulator += current, 0));
    };

    this.turnOn = () => {
        this.setDefaultState();
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
            else if (target.matches(".cancel")) {
                this.setDefaultState();
            }
            else if (target.matches(".operator")) {
                // if (symbol === "←") this.undoMemory();
                if (this.processor[0] === null) {
                    this.processor[0] = this.convertToNum(this.memory);
                    this.processor[1] = symbol;
                }
                else {
                    if (this.memory.contents.length) {
                        this.processor[2] = this.convertToNum(this.memory);
                        this.doTheMath();
                    }
                    this.processor[1] = symbol;
                }
                console.log(this.processor);
                this.resetMemory();
                this.showResult();
            }
            else if (target.matches("#process")) {
                this.doTheMath();
                this.resetMemory();
                this.showResult();
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