"use-strict";

const querySelector = (ele) => document.querySelector(ele);
const querySelectorAll = (ele) => document.querySelectorAll(ele);

const QUESTIONS = [
  {
    id: 1,
    step: 1,
    title: "Step 1 : Select your shape",
    cta: "Go to step 2",
    description: () =>
      `Please select the shape that you would like to calculate the area of and press the button "Go to step 2"`,
    isCancelable: true,
    isNextable: true,
    options: [
      {
        id: 1,
        title: "Rectangle",
        type: "radio",
      },
      {
        id: 2,
        title: "Circle",
        type: "radio",
      },
      {
        id: 3,
        title: "Square",
        type: "radio",
      },
      {
        id: 4,
        title: "Ellipse",
        type: "radio",
      },
    ],
  },
  {
    id: 2,
    step: 2,
    title: "Step 2 : Insert your values",
    cta: "Go to step 3",
    description: (type = "?") =>
      `You have selected a <strong>${type}</strong>, please input the required variables.`,
    isCancelable: true,
    isNextable: true,
    options: [
      {
        id: 1,
        title: "Width",
        type: "number",
      },
      {
        id: 2,
        title: "Height",
        type: "number",
      },
    ],
  },
  {
    id: 3,
    step: 3,
    title: "Step 3 : Your result",
    cta: "Start over",
    description: (type = "?", value) => {
      let measures = [];
      for (let key in value) {
        measures.push(`${key} of ${value[key]}`);
      }

      return `You have calculated the area of a <strong>${type}</strong>
      with a ${measures.length > 1 ? measures.join(" and ") : measures
        }. Below is your result:`;
    },
    isCancelable: false,
    isNextable: false,
    options: [
      {
        id: 1,
        title: "Area",
        type: "result",
      },
    ],
  },
];

class Area {
  constructor(width = 0, height = 0) {
    this._width = width;
    this._height = height;
    this._area = 0;
    this.shape = "";
  }

  set width(value) {
    this._width = value;
  }

  get width() {
    return this._width;
  }

  set height(value) {
    this._height = value;
  }

  setShape(shape) {
    this.shape = shape;
  }

  get area() {
    switch (this.shape.toLowerCase()) {
      case "rectangle":
        return this._width * this._height;
      case "square":
        return this._width * this._height;
      case "circle":
        return Math.PI * Math.pow(this._width, 2);
      case "ellipse":
        return this._width * this._height * Math.PI;
      default:
        return 0;
    }
  }
}

class Calculator extends Area {
  constructor() {
    super();
    this.question = QUESTIONS;
    this._stepLength = this.question.length;
    this.step = 0;
  }

  get cancel() {
    this.step = 0;
    return this.question[0];
  }
  get next() {
    this.step = this.step + 1;
    if (this.step >= this._stepLength) this.step = 0;
    return this.question[this.step];
  }

  get getQuestion() {
    return this.question[this.step];
  }

  render(ele, prop) {
    if (typeof prop == "string") {
      this._res = this.question[this.step][prop];
      if (typeof this._res == "string") ele.innerHTML = this._res;
      if (typeof this._res == "function")
        ele.innerHTML = this._res(this.shape, this._area);
    }
  }

  get reset() {
    this._width = 0;
    this._height = 0;
    this._area = 0;
    this.shape = "";
    this.step = 0;
  }
}

const calculator = new Calculator();

const actionBtn = querySelector("#actionBtn");
const cancelBtn = querySelector("#cancelBtn");
const step = querySelector("#step");
const question = querySelector("#question");
const option = querySelector("#option");
const inputRadio = querySelectorAll("input[type=radio]");
const inputNum = querySelectorAll("input[type=number]");

const toggleDisplay = (s) => {
  const s0 = querySelector("#step-1");
  const s1 = querySelector("#step-2");
  const s2 = querySelector("#step-3");
  if (s == 1) {
    s0.style.display = "none";
    s1.style.display = "block";
    s2.style.display = "none";
    return;
  }
  if (s == 2) {
    s0.style.display = "none";
    s1.style.display = "none";
    s2.style.display = "block";
    return;
  }
  s0.style.display = "block";
  s1.style.display = "none";
  s2.style.display = "none";
  return;
};

toggleDisplay(0);
calculator.render(actionBtn, "cta");
calculator.render(step, "title");
calculator.render(question, "description");

const value1 = querySelector("#width");
const value2 = querySelector("#height");

actionBtn.addEventListener("click", (e) => {
  calculator.next;
  calculator.render(actionBtn, "cta");
  calculator.render(step, "title");
  calculator.render(question, "description");
  if (calculator.shape == "square") {
    value2.style.display = "none";
  }
  if (calculator.step == 2) {
    const area = calculator.area;
    console.log(area);
    querySelector("#step-3").innerText = `The Answer is ${area}`;
    inputRadio.forEach((radio) => (radio.checked = false));
    inputNum.forEach((num) => (num.value = ""));
  }
  toggleDisplay(calculator.step);
});

cancelBtn.addEventListener("click", () => {
  calculator.cancel;
  calculator.render(actionBtn, "cta");
  calculator.render(step, "title");
  calculator.render(question, "description");
  toggleDisplay(calculator.step);
  inputNum.forEach((num) => (num.value = ""));
  inputRadio.forEach((radio) => (radio.checked = false));
  calculator.reset;
});

inputRadio.forEach((i) =>
  i.addEventListener("change", (e) => {
    calculator.setShape(e.target.value);
  })
);

inputNum.forEach((i) =>
  i.addEventListener("change", (e) => {
    if (e.target.name == "width")
      calculator._width = parseFloat(e.target.value);
    if (e.target.name == "height")
      calculator.height = parseFloat(e.target.value);
  })
);
