class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    if (this.currentOperand === "0") return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === "") this.currentOperand = "0";
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "0";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand,
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

const previousOperandTextElement = document.getElementById("previous-operand");
const currentOperandTextElement = document.getElementById("current-operand");
const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement,
);

// Button Inputs
const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.number) {
      calculator.appendNumber(button.dataset.number);
      calculator.updateDisplay();
    }
    if (button.dataset.operator) {
      calculator.chooseOperation(button.dataset.operator);
      calculator.updateDisplay();
    }
    if (button.dataset.action === "calculate") {
      calculator.compute();
      calculator.updateDisplay();
    }
    if (button.dataset.action === "clear") {
      calculator.clear();
      calculator.updateDisplay();
    }
    if (button.dataset.action === "delete") {
      calculator.delete();
      calculator.updateDisplay();
    }
  });
});

// Keyboard Support
document.addEventListener("keydown", (e) => {
  if ((e.key >= 0 && e.key <= 9) || e.key === ".") {
    calculator.appendNumber(e.key);
  }
  if (e.key === "+" || e.key === "-") {
    calculator.chooseOperation(e.key);
  }
  if (e.key === "*" || e.key === "x") {
    calculator.chooseOperation("*");
  }
  if (e.key === "/" || e.key === "%") {
    calculator.chooseOperation("/");
  }
  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault(); // Prevent Enter from hitting focused button
    calculator.compute();
  }
  if (e.key === "Backspace") {
    calculator.delete();
  }
  if (e.key === "Escape") {
    calculator.clear();
  }
  calculator.updateDisplay();
});
