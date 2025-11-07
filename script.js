//
// DOM ELEMENTS
//

/* theme toggle */
const ThemeToggleCircle = document.querySelector(".toggle-circle");
const ThemeToggleBtn = document.querySelector(".toggle-theme-btn");
const sunIconFill = document.querySelector(".sun-icon > path");
const moonIconFill = document.querySelector(".moon-icon > path");

/* main menu quiz options */

const quizOptions = document.querySelectorAll(".choose-quiz-option");

//
// STATE MANAGEMENT
//
let darkMode = localStorage.getItem("darkMode");

let allQuizData;

let currentQuiz;

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
      let allQuizData = data.quizzes;

      //get data for current quiz
      let currentQuiz = allQuizData[index];

      console.log(currentQuiz, "current quiz");
    });
}
