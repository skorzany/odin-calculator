function Calculator(controls, display) {
    this.SCREENLENGTH = 17;    // long decimals will get rounded to fit this many characters
    this.controls = controls;
    this.display = display;

    this.setDefaultState = () => {
        this.processor = [null, null, null];    // [x, operator, y]
        this.memory = {"signed": false, "contents": []};
        this.error = false;
        this.enableHovers();
        this.clearHighlights();
        this.showResult();
    };

    this.resetMemory = () => {
        this.memory.signed = false;
        this.memory.contents = [];
    };

    this.clearHighlights = () => {
        const clicked = document.querySelector(".clicked");
        if (clicked) clicked.classList.remove("clicked");
    };

    this.showResult = () => {
        let result = this.processor[0] ?? 0;
        if (this.error) {
            this.display.textContent = result;
            this.disableHovers();
            return;
        }
        if (!Number.isInteger(result)) {
            const L = String(result).length;
            const dotPosition = String(result).indexOf(".");
            if (this.SCREENLENGTH < L) {
                result = result.toFixed(this.SCREENLENGTH - (dotPosition + 1));
            }
        }
        this.display.textContent = parseFloat(result);
    };

    this.enableHovers = () => {
        const buttons = [...document.querySelectorAll(".circle")];
        buttons.map((ele) => {
            if (!ele.classList.contains("clear")) ele.classList.toggle("hoverable");
        });
    };

    this.disableHovers = () => {
        const buttons = [...document.querySelectorAll(".hoverable")];
        buttons.map((ele) => {
            if (!ele.classList.contains("clear")) ele.classList.toggle("hoverable");
        });
    };

    this.doTheMath = () => {
        let [x, op, y] = [...this.processor];
        let result = (function () {
            switch (op) {
                case "+": return x + y;
                case "−": return x - y;
                case "×": return x*y;
                case "÷": return (y !== 0) ? x/y : "DivByZero";
            }
        })();
        result = result ?? y;
        this.processor[0] = result;
        this.processor[2] = null;
        if (result === "DivByZero") {
            this.clearHighlights();
            this.error = true;
        };
    };

    this.viewMemory = () => {
        let s = this.memory.contents.join("");
        s = s.replace(/^0+/, "");   // remove leading zeros
        s = (s === "") ? "0" : s;
        if (s[0] === ".") s = "0" + s;
        if (this.memory.signed) {
            if (this.convertToNum(this.memory) !== 0) s = "-" + s;
        }
        this.display.textContent = s;
    };

    this.updateMemory = (x) => {
        this.memory.contents.push(x);
        this.viewMemory();
    };

    this.changeSign = () => {
        if (this.memory.contents.length) this.signMemory();
        else this.signResult();
    };

    this.signMemory = () => {
        this.memory.signed = !this.memory.signed;
        this.viewMemory();
    };

    this.signResult = () => {
        this.processor[0] *= -1;
        this.showResult();
    };

    this.floatMemory = () => {
        if (!this.memory.contents.includes(".")) this.memory.contents.push(".");
        this.viewMemory();
    };

    // this.undoMemory = () => {
    //     this.memory.contents.pop();
    // };

    this.solveEquation = (operator) => {
        if (this.processor[0] === null) {
            this.processor[0] = this.convertToNum(this.memory);
            this.processor[1] = operator;
        }
        else {
            if (this.memory.contents.length) {
                this.processor[2] = this.convertToNum(this.memory);
                this.doTheMath();
            }
            this.processor[1] = operator;
        }
    };

    this.convertToNum = (obj) => {
        const sign = obj.signed ? -1 : 1;
        const arr = obj.contents;
        const decimalIdx = arr.indexOf(".");
        let whole = (decimalIdx === -1) ? arr.slice() : arr.slice(0, decimalIdx);
        let fraction = (decimalIdx === -1) ? [] : arr.slice(decimalIdx + 1);

        whole = whole.map((val, idx) => val*10**(whole.length - 1 - idx));
        fraction = fraction.map((val, idx) => val*10**(-idx - 1));

        return sign*(
            whole.reduce((current, accumulator) => accumulator += current, 0)
            + fraction.reduce((current, accumulator) => accumulator += current, 0)
        );
    };

    this.highlightOperator = (target) => {
        if (target.classList.contains("sticky")) {
            this.clearHighlights();
            target.classList.add("clicked");
        }
        else this.clearHighlights();
    };

    this.turnOn = () => {
        this.setDefaultState();
        this.controls.addEventListener("click", e => {
            const target = e.target;
            const symbol = target.textContent;
            if (!this.error) {
                if (target.matches(".number")) {
                    if (!isNaN(symbol)) this.updateMemory(Number(symbol));
                    else {
                        if (symbol === ",") this.floatMemory();
                        else if (symbol === "±") this.changeSign();
                    }
                }
                else if (target.matches(".operator")) {
                    this.highlightOperator(target);
                    this.solveEquation(symbol);
                    this.showResult();
                    this.resetMemory();
                }
                else if (target.matches(".special")) {
                    if (symbol === "%") console.log('percent');
                    else console.log('arrow');
                }
                else if (target.matches(".clear")) {
                    this.setDefaultState();
                }
            }
            else if (target.matches(".clear")) this.setDefaultState(); // DivByZero case, lock everything but C button
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