//
// DOM ELEMENTS
//

/* theme toggle */
const ThemeToggleCircle = document.querySelector(".toggle-circle");
const ThemeToggleBtn = document.querySelector(".toggle-theme-btn");
const sunIconFill = document.querySelector(".sun-icon > path");
const moonIconFill = document.querySelector(".moon-icon > path");

/* main menu screen */

const mainMenuScreen = document.querySelector("#main-menu");

/* main menu quiz options */
const quizOptions = document.querySelectorAll(".choose-quiz-option");

/* quiz UI screen */

const quizScreen = document.querySelector("#quiz-ui");

//next question button

const nextQuestionBtn = document.querySelector("#next-question-btn");

//
// STATE MANAGEMENT
//
let darkMode = localStorage.getItem("darkMode");

let allQuizData;

let currentQuiz;

let doesQuizDataExist = false;

let quizScore = 0;

let currentQuestionIndex = 0;

let currentQuizData = {
  title: "Math",
  questions: [
    {
      question: "What is 1 + 1",
      options: ["2", "3", "4", "5"],
    },
  ],
};

console.log(currentQuizData);

// Check saved theme on load
if (darkMode === "enabled") {
  enableDarkMode();
}

//
// EVENT LISTENERS
//
ThemeToggleBtn.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");

  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

quizOptions.forEach((quizOption, quizDataindex) => {
  quizOption.addEventListener("click", () => {
    fetchQuizData(quizDataindex);
  });
});

// update set of questions when user clicks on next question button
nextQuestionBtn.addEventListener("click", changeQuestion);

//
// FUNCTIONS
//

function enableDarkMode() {
  console.log("enable dark mode");
  // add dark mode classes
  document.body.classList.add("dark-mode");
  ThemeToggleCircle.classList.add("dark-mode");
  // change fill of icons
  moonIconFill.style.fill = "#fff";
  sunIconFill.style.fill = "#fff";
  //set dark mode value to enabled in local storage
  localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
  //remove dark mode classes

  document.body.classList.remove("dark-mode");
  ThemeToggleCircle.classList.remove("dark-mode");
  //change fill of icons

  moonIconFill.style.fill = "#626C7F";
  sunIconFill.style.fill = "#626C7F";
  localStorage.setItem("darkMode", null);
}

// Get Data for selected quiz

function fetchQuizData(index) {
  //FETCH QUIZ DATA
  //

  fetch("./data.json")
    .then((response) => {
      if (!response.ok) return console.log("Error");

      return response.json();
    })

    .then((data) => {
      //get data for all quizzes
      allQuizData = data.quizzes;

      //get data for current quiz
      currentQuiz = allQuizData[index];

      doesQuizDataExist = true;
      return currentQuiz;
    });

  showQuizUI();
}

// show the full quiz ui
function showQuizUI() {
  if (!doesQuizDataExist) return;

  //hide main menu
  mainMenuScreen.classList.remove("active");

  //show quiz ui
  quizScreen.classList.add("active");

  // change the data
  currentQuizData.title = currentQuiz.title;

  // all current quiz questions
  // quizData.questions = currentQuiz.questions;

  console.log(currentQuizData, "current quiz data");
  //show first set of questions
  changeQuestion();
}

function changeQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length) {
    let currentQuestionData = currentQuiz.questions[currentQuestionIndex];

    let currentQuestionOptions = currentQuestionData.options;

    currentQuestionOptions.forEach((option) => {
      // currentQuizData.questions.options.push(option);
    });

    console.log(currentQuestionData, "options");
    //move to next question
    currentQuestionIndex++;
  }
}
