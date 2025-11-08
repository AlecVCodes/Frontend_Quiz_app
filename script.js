//
// DOM ELEMENTS
//

/* theme toggle */
const themeToggleCircle = document.querySelector(".toggle-circle");
const themeToggleBtn = document.querySelector(".toggle-theme-btn");
const sunIconFill = document.querySelector(".sun-icon > path");
const moonIconFill = document.querySelector(".moon-icon > path");

/* main menu screen */
const mainMenuScreen = document.querySelector("#main-menu");

/* main menu quiz options */
const quizOptionButtons = document.querySelectorAll(".choose-quiz-option");

/* quiz UI screen */
const quizUIScreen = document.querySelector("#quiz-ui");

/* quiz options ui */
const quizQuestion = document.querySelector(".current-quiz-question");

const quizAnswers = document.querySelectorAll(".quiz-list > li");

const quizAnswerstitle = document.querySelectorAll(".quiz-answer-title");

/* next question button */
const nextQuestionButton = document.querySelector("#next-question-btn");

//
// STATE MANAGEMENT
//
let darkMode = localStorage.getItem("darkMode");

let quizLibrary; // all quizzes from JSON
let selectedQuiz; // currently chosen quiz
let isQuizLoaded = false;

let userInputtedAnswer;

let quizScore = 0;
let activeQuestionIndex = 0;

let activeQuizState = {
  title: "",
  questions: [
    {
      question: "",
      options: ["", "", "", ""],
    },
  ],
  answer: "",
};

console.log(activeQuizState);

// Check saved theme on load
if (darkMode === "enabled") {
  enableDarkMode();
}

//
// EVENT LISTENERS
//
themeToggleBtn.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");

  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

// main menu event listeners
quizOptionButtons.forEach((quizOptionButton, quizIndex) => {
  quizOptionButton.addEventListener("click", () => {
    fetchQuizData(quizIndex);
  });
});

// current quiz event listeners

quizAnswers.forEach((answer, index) => {
  answer.addEventListener("click", () => {
    userInputtedAnswer = answer.textContent;

    //add active class
    showSelectedAnswer(answer);

    return userInputtedAnswer;
  });
});

// update set of questions when user clicks on next question button
nextQuestionButton.addEventListener("click", () => {
  // check answer of user
  checkAnswer();

  // after checking answer then change the ui
  changeQuestionLogic();
});

//
// FUNCTIONS
//

function enableDarkMode() {
  console.log("enable dark mode");
  // add dark mode classes
  document.body.classList.add("dark-mode");
  themeToggleCircle.classList.add("dark-mode");
  // change fill of icons
  moonIconFill.style.fill = "#fff";
  sunIconFill.style.fill = "#fff";
  // set dark mode value to enabled in local storage
  localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
  // remove dark mode classes
  document.body.classList.remove("dark-mode");
  themeToggleCircle.classList.remove("dark-mode");
  // change fill of icons
  moonIconFill.style.fill = "#626C7F";
  sunIconFill.style.fill = "#626C7F";
  localStorage.setItem("darkMode", null);
}

// Get Data for selected quiz
function fetchQuizData(index) {
  // FETCH QUIZ DATA
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) return console.log("Error");

      return response.json();
    })
    .then((data) => {
      // get data for all quizzes
      quizLibrary = data.quizzes;

      // get data for current quiz
      selectedQuiz = quizLibrary[index];

      isQuizLoaded = true;
      return selectedQuiz;
    });

  showQuizUI();
}

// show the full quiz UI
function showQuizUI() {
  if (!isQuizLoaded) return;

  // hide main menu
  mainMenuScreen.classList.remove("active");

  // show quiz UI
  quizUIScreen.classList.add("active");

  // change the data
  activeQuizState.title = selectedQuiz.title;

  // show first set of questions
  changeQuestionLogic();
}

function changeQuestionLogic() {
  if (activeQuestionIndex < selectedQuiz.questions.length) {
    let activeQuestionData = selectedQuiz.questions[activeQuestionIndex];

    let activeQuestionOptions = activeQuestionData.options;

    // change the question
    activeQuizState.questions[0].question = activeQuestionData.question;

    // change user options
    activeQuestionOptions.forEach((option, index) => {
      // add values to activeQuizState object
      activeQuizState.questions[0].options[index] = option;
    });

    // change the answer
    activeQuizState.answer = activeQuestionData.answer;

    // move to next question
    activeQuestionIndex++;

    //

    console.log(activeQuizState, "active quiz state");

    changeQuestionUI();
  }
}

function changeQuestionUI() {
  quizQuestion.textContent = activeQuizState.questions[0].question;

  quizAnswerstitle.forEach((answer, index) => {
    // loop through each question html element and show the corresponding question based on the index

    answer.textContent = activeQuizState.questions[0].options[index];
  });
}

function showSelectedAnswer(answer) {
  quizAnswers.forEach((answer) => {
    console.log(answer, "answer ui");
    answer.classList.remove("active");
  });
  answer.classList.add("active");
}

function checkAnswer() {
  console.log("check answer function ran");
  // check if answer is incorrect
  if (userInputtedAnswer !== activeQuizState.answer) {
    return;
  } else {
    console.log("correct answer! well done");
  }
}
