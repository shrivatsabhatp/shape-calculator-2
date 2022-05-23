"use-strict";

const querySelector = (ele) => document.querySelector(ele);
const querySelectorAll = (ele) => document.querySelectorAll(ele);

const QUESTIONS = [
  {
    id: 1,
    title: "Step 1 : Select your shape",
    cta: "Go to step 2",
    description: () =>
      `Please select the shape that you would like to calculate the area of and press the button "Go to step 2"`,
  },
  {
    id: 2,
    title: "Step 2 : Insert your values",
    cta: "Go to step 3",
    description: (type = "?") =>
      `You have selected a <strong>${type}</strong>, please input the required variables.`,
  },
  {
    id: 3,
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
  },
];

const Rectangle = (w, h) => w * h
const Square = l => l * l
const Circle = r => Math.PI * r * r
const Ellipse = (w, h) => Math.PI * w * h

function Result(shape) {
  if (shape.toLowerCase() == 'rectangle')
    return Rectangle
  if (shape.toLowerCase() == 'square')
    return Square
  if (shape.toLowerCase() == 'circle')
    return Circle
  if (shape.toLowerCase() == 'ellipse')
    return Ellipse
  return () => { }
}

let iterator = null
let global_state = { shape: '', width: 0, height: 0, result: 0 }

const actionBtn = querySelector("#actionBtn");
const cancelBtn = querySelector("#cancelBtn");
const step = querySelector("#step");
const question = querySelector("#question");
const option = querySelector("#option");
const inputRadio = querySelectorAll("input[type=radio]");
const inputNum = querySelectorAll("input[type=number]");
const step1 = querySelector("#step-1");
const step2 = querySelector("#step-2");
const step3 = querySelector("#step-3");

const toggleDisplay = (currStep) => {
  [step1, step2, step3].forEach((step, idx) => {
    if (currStep == idx) {
      step.style.display = 'block'
      return
    }
    step.style.display = 'none'
  })
};

const formatInputRequest = (shape) => {
  if (shape.toLowerCase() == 'circle' || shape.toLowerCase() == 'square') {
    step2.children[1].style.display = 'none'
    return
  }
  [...step2.children].forEach(ele => ele.style.display = 'block')
}

function Render(ele, prop) {
  return function (...args) {
    ele.innerHTML = prop(...args);
    return ele
  }
}
const RenderHeading = (step = 0) => QUESTIONS[step]['title']
const RenderQuestion = (...args) => (step = 0) => QUESTIONS[step]['description'](...args)
const RenderCTA = (step = 0) => QUESTIONS[step]['cta']


function* Next(i, len) {
  while (i < len) {
    Render(step, RenderHeading)(i)
    Render(actionBtn, RenderCTA)(i)
    Render(question, RenderQuestion(global_state.shape, { width: global_state.width, height: global_state.height }))(i)
    toggleDisplay(i)
    formatInputRequest(global_state.shape)
    yield i
    if (i == 0 && global_state.shape == '') {
      return
    }
    i++;
  }
}

// Reset all 
const Reset = () => {
  iterator = Next(0, QUESTIONS.length)
  inputRadio.forEach((radio) => (radio.checked = false));
  inputNum.forEach((num) => (num.value = ""));
  global_state = { ...global_state, shape: '', width: 0, height: 0, result: 0 }
}

// CTA button handler
actionBtn.addEventListener("click", () => {
  const isDone = iterator.next();
  if (isDone?.done) {
    Reset();
    iterator.next();
  }
  if (isDone.value == 2) {
    const ans = Result(global_state.shape)(global_state.width, global_state.height)
    querySelector("#step-3").innerText = `The Answer is ${ans}`;
  }
})

// cancel button handler
cancelBtn.addEventListener("click", (e) => {
  Reset();
  iterator.next();
})

// listen shape selection
inputRadio.forEach((input) =>
  input.addEventListener("change", (e) => {
    // clear rest
    inputRadio.forEach((radio) => (radio.checked = e.target.name == radio.id));
    global_state.shape = e.target.value
    console.log(e)
  })
);

// listen input values
inputNum.forEach((input) =>
  input.addEventListener("change", (e) => {
    global_state[e.target.name.toLowerCase()] = e.target.value
    console.log(e.target.name, global_state);
  })
);


Reset()
iterator.next();