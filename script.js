//
// DOM ELEMENTS
//
const ThemeToggleCircle = document.querySelector(".toggle-circle");
const ThemeToggleBtn = document.querySelector(".toggle-theme-btn");
const sunIconFill = document.querySelector(".sun-icon > path");
const moonIconFill = document.querySelector(".moon-icon > path");
//
// STATE MANAGEMENT
//
let darkMode = localStorage.getItem("darkMode");

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



//
//FETCH QUIZ DATA
//

let allQuizData;

fetch("./data.json")
  .then((response) => {
    if (!response.ok) return console.log("Error");

    return response.json();
  })
  .then((data) => {
    let allQuizData = data;

    console.log(allQuizData, "all quiz data");
  });

//
// <FUNCTIONS></FUNCTIONS>
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

function fetchQuizData(quizData) {

}
