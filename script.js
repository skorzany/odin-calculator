function Calculator(controls, display) {
    this.SCREENLENGTH = 17;     // long decimals will get rounded to fit this many characters
    this.SCROLLSIZE = 999999999;     // should be a very big number, to allow auto-scrolling the whole result
    this.OPERATORMAP = {"/": "divide", "÷": "divide", "*": "times", "×": "times", "-": "minus", "−": "minus", "+": "plus", "Enter": "equals", "=": "equals",};
    this.KEYSTOSYMBOLS = {"/": "÷", "*": "×", "-": "−", "+": "+",};
    this.controls = controls;
    this.display = display;

    this.setDefaultState = () => {
        this.processor = [null, null, null];    // [x, operator, y]
        this.memory = {"signed": false, "contents": []};
        this.error = false;
        this.display.style.removeProperty("color");
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
        this.display.scrollLeft = -this.SCROLLSIZE;     // scroll the view to the most significant part of the result
    };

    this.enableHovers = () => {
        const buttons = [...document.querySelectorAll(".circle")];
        buttons.map((ele) => {
            if (!ele.classList.contains("clear")) ele.classList.add("hoverable");
        });
    };

    this.disableHovers = () => {
        const buttons = [...document.querySelectorAll(".hoverable")];
        buttons.map((ele) => {
            if (!ele.classList.contains("clear")) ele.classList.remove("hoverable");
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
        this.display.textContent = s;   // to prevent decimal point from disappearing during input, we need a string, not parsed float
        this.display.scrollLeft = this.SCROLLSIZE;      // keep the latest entry in focus
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

    this.percents = () => {
        if (this.memory.contents.length) {
            this.pctMemory();
            this.viewMemory();
        }
        else {
            this.pctResult();
            this.showResult();
        }
    };

    this.pctMemory = () => {
        const oldDotPosition = this.memory.contents.indexOf(".");
        if (oldDotPosition !== -1) {
            const newDotPosition = oldDotPosition - 2;
            this.memory.contents.splice(oldDotPosition, 1);
            if (0 <= newDotPosition) this.memory.contents.splice(newDotPosition, 0, '.');
            else {
                const shift = (newDotPosition === -1) ? [".", 0] : [".", 0, 0];
                this.memory.contents = [...shift, ...this.memory.contents];
            }
        }
        else {
            const dotPos = this.memory.contents.length - 2;
            if (0 <= dotPos) this.memory.contents.splice(dotPos, 0, ".");
            else this.memory.contents.splice(0, 0, ".", 0);
        }
        this.removeTrailingZeros(this.memory.contents);     // we're not doing math but simply manipulating dot position, so in cases where user input was an integer ending with more than two 0's, additional cleanup is required for proper display
    };

    this.removeTrailingZeros = (arr) => {
        let lastItem = arr[arr.length - 1];
        while (lastItem === 0) {
            arr.pop();
            lastItem = arr[arr.length - 1];
        }
        if (lastItem === ".") arr.pop();
    };

    this.pctResult = () => {this.processor[0] /= 100;}

    this.eraseLastChar = () => {
        const resultInFocus = (Math.abs(this.display.textContent - this.processor[0]) < 0.000001);  // comparing two floats is kinda impossible so instead we look if their difference is very small
        if (resultInFocus && !this.memory.contents.length) {
            this.undoResult();
            this.showResult();
        }
        else {
            this.undoMemory();
            this.viewMemory();
        }
    };

    this.undoMemory = () => {
        this.memory.contents.pop();
        if (this.memory.contents.length === 0) this.memory.signed = false;
    };

    this.undoResult = () => {
        const result = this.processor[0] ?? 0;
        let resultAsString = String(result);
        if (resultAsString.indexOf("e") === -1) {
            if (resultAsString.length > this.SCREENLENGTH) {resultAsString = resultAsString.slice(0, this.SCREENLENGTH)}    // prevent 'eating' backspace inputs by operating only on the 'visible' part
            resultAsString = resultAsString.slice(0, -1);
            if (resultAsString === "-") resultAsString = "0";
        }
        else {
            // when resultAsString is a number in exponential form
            resultAsString = Number(resultAsString).toFixed(100);
            if (1 <= Math.abs(resultAsString)) {
                resultAsString = String(Math.trunc(resultAsString/10));
            }
            else resultAsString = "0";  // exponential form in range 0-1, means it's abysmally small, so just convert it to 0, this ain't no pharmacy
        }
        this.processor[0] = Number(resultAsString);
    };

    this.solveEquation = (operator) => {
        if (this.processor[0] === null) {
            this.processor[0] = this.convertToNum(this.memory);
        }
        else if (this.memory.contents.length) {
                this.processor[2] = this.convertToNum(this.memory);
                this.doTheMath();
        }
        this.processor[1] = operator;
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
        if (target in this.OPERATORMAP) target = document.querySelector("." + this.OPERATORMAP[target]);
        if (target.classList.contains("sticky")) {
            this.clearHighlights();
            target.classList.add("clicked");
        }
        else this.clearHighlights();
    };

    this.turnOn = () => {
        this.setDefaultState();
        // disable context menu
        document.addEventListener("contextmenu", e => e.preventDefault());
        // mouse support
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
                    if (symbol === "%") this.percents();
                    else if (symbol === "←") this.eraseLastChar();
                }
                else if (target.matches(".clear")) {
                    this.setDefaultState();
                }
            }
            else if (target.matches(".clear")) this.setDefaultState(); // DivByZero case, lock everything but C button
        });
        // keyboard support
        document.addEventListener("keydown", e => {
            const keyName = e.key;
            if (keyName === "/") e.preventDefault();    // Firefox uses this key for 'Quick find'
            if (keyName === "Escape") this.setDefaultState();   // error or not, Escape should always be able to clear
            if (!this.error) {
                if (!isNaN(keyName)) this.updateMemory(Number(keyName));
                else if (keyName === "Backspace") this.eraseLastChar();
                else if (keyName === "%") this.percents();
                else if (keyName === "`") this.changeSign();
                else if (".,".includes(keyName)) this.floatMemory();
                else if ("/*-+=".includes(keyName) || keyName === "Enter") {
                    this.highlightOperator(keyName);
                    this.solveEquation(this.KEYSTOSYMBOLS[keyName]);
                    this.showResult();
                    this.resetMemory();
                }
            }
        });
        // below is kind of an 'easter egg' and is not necessary for this project to work
        // it is a small practice on handling multiple keys being pressed at the same time
        // precisely, when Ctrl+s or Ctrl+S (if Caps Lock is on) or Ctrl+Shift+s is pressed
        this.keysPressed = {};
        document.addEventListener("keydown", e => {
            this.keysPressed[e.key] = true;
            if (this.keysPressed["Control"] && e.key.toLowerCase() === "s") {
                e.preventDefault();
                this.error = true;
                this.display.style.color = "purple";
                this.display.textContent = "Made by Skorzany";
                this.disableHovers();
            }
        });
        document.addEventListener("keyup", e => {
            this.keysPressed[e.key] = false;
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