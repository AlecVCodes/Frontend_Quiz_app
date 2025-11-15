//
// DOM ELEMENTS
//

/* theme toggle */
const themeToggleCircle = document.querySelector(".toggle-circle");
const themeToggleBtn = document.querySelector(".toggle-theme-btn");
const sunIconFill = document.querySelector(".sun-icon > path");
const moonIconFill = document.querySelector(".moon-icon > path");

/* background image */
const backgroundImage = document.querySelector(".background-img");
/* main menu screen */
const mainMenuScreen = document.querySelector("#main-menu");

/* main menu quiz options */
const quizOptionButtons = document.querySelectorAll(".choose-quiz-option");

/* quiz UI screen */
const quizUIScreen = document.querySelector("#quiz-ui");
const quizOptionTitle = document.querySelector(".quiz-option-title");
const progressBarFill = document.querySelector(".progress-bar-filled");

const quizAnswersContainer = document.querySelector(".quiz-list");

quizAnswersContainer.style.pointEvents = "none";

/* quiz options ui */
const quizQuestion = document.querySelector(".current-quiz-question");
const quizQuestionNumberUI = document.querySelector(".question-number");

const quizAnswers = document.querySelectorAll(".quiz-list > li");

const quizAnswerstitle = document.querySelectorAll(".quiz-answer-title");

const questionErrorMessage = document.querySelector(".error-message");
/* next question button */
const submitAnswerButton = document.querySelector("#next-question-btn");

/* game completed UI */

const gameCompletedUI = document.querySelector("#end-quiz");
const finalScoreText = document.querySelector(".final-score-text");
const scoreCardTitle = document.querySelector(".score-card-title");
const playAgainBtn = document.querySelector(".play-again-btn");
//
// STATE MANAGEMENT
//
let darkMode = localStorage.getItem("darkMode");

let quizLibrary; // all quizzes from JSON
let selectedQuiz; // currently chosen quiz
let isQuizLoaded = false;

let userInputtedAnswerUI;
let userInputtedAnswerValue;
let submittedAnswer = null;

let currentQuestionNumber = 1;
let quizScore = 0;
let activeQuestionIndex = 0;

const activeQuizState = {
  title: "",
  questions: [
    {
      question: "",
      options: ["", "", "", ""],
    },
  ],
  answer: "",
};

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
    //answer UI
    userInputtedAnswerUI = answer;
    // answer value

    userInputtedAnswerValue = answer.querySelector("label h2").textContent;

    //add active class
    showSelectedAnswer(answer);

    return userInputtedAnswerValue;
  });
});

// update set of questions when user clicks on next question button
submitAnswerButton.addEventListener("click", () => {
  if (submittedAnswer === null) {
    // check answer of user
    checkAnswer();
  } else {
    // after checking answer then change the ui

    //change quiz question number
    currentQuestionNumber = currentQuestionNumber + 1;

    changeQuestionLogic();
  }
});

//Restart the game
playAgainBtn.addEventListener("click", () => {
  showQuizUI();
});

//
// FUNCTIONS
//

function enableDarkMode() {
  // add dark mode classes
  document.body.classList.add("dark-mode");
  themeToggleCircle.classList.add("dark-mode");
  // change fill of icons
  moonIconFill.style.fill = "#fff";
  sunIconFill.style.fill = "#fff";
  // set dark mode value to enabled in local storage
  localStorage.setItem("darkMode", "enabled");

  // change background image to dark version
  backgroundImage.classList.replace("light", "dark");
  updateSources("dark");
}

function disableDarkMode() {
  // remove dark mode classes
  document.body.classList.remove("dark-mode");
  themeToggleCircle.classList.remove("dark-mode");
  // change fill of icons
  moonIconFill.style.fill = "#626C7F";
  sunIconFill.style.fill = "#626C7F";
  localStorage.setItem("darkMode", null);

  // change background image to light version
  backgroundImage.classList.replace("dark", "light");
  updateSources("light");
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
  // reset all key state variables
  quizScore = 0;
  activeQuestionIndex = 0;
  currentQuestionNumber = 1;
  submittedAnswer = null;
  userInputtedAnswerValue = null;
  userInputtedAnswerUI = null;

  if (!isQuizLoaded) return;

  //hide end screen if restarting game
  gameCompletedUI.classList.remove("active");
  // hide main menu
  mainMenuScreen.classList.remove("active");

  // show quiz UI
  quizUIScreen.classList.add("active");

  // change the data
  activeQuizState.title = selectedQuiz.title;

  //change HTML of quiz title
  quizOptionTitle.style.display = "flex";
  if (activeQuizState.title === "HTML") {
    quizOptionTitle.innerHTML = `
  <div class="icon-background html">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
      <path fill="#FF7E35" d="M24.508 7.607a1.25 1.25 0 0 1 .634 1.65l-10 22.5a1.25 1.25 0 1 1-2.284-1.015l10-22.5a1.251 1.251 0 0 1 1.65-.635ZM10.832 13.44a1.249 1.249 0 0 1 .1 1.765L6.674 20l4.263 4.795a1.25 1.25 0 1 1-1.87 1.66l-5-5.625a1.25 1.25 0 0 1 0-1.66l5-5.625a1.25 1.25 0 0 1 1.764-.105Zm18.337 0a1.25 1.25 0 0 1 1.765.105l5 5.625a1.25 1.25 0 0 1 0 1.66l-5 5.625a1.25 1.25 0 1 1-1.87-1.66L33.327 20l-4.262-4.795a1.25 1.25 0 0 1 .105-1.765Z"/>
    </svg>
  </div>
  <h2>HTML</h2>
`;
  }
  if (activeQuizState.title === "CSS") {
    quizOptionTitle.innerHTML = `
  <div class="icon-background css">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40"><path fill="#2FD887" d="M10 2.505a1.25 1.25 0 0 0-1.25 1.25V21.25a5 5 0 0 0 5 5H15v6.25a4.999 4.999 0 0 0 9.615 1.913c.25-.607.38-1.257.38-1.913v-6.25h1.255a5 5 0 0 0 5-5V3.755A1.25 1.25 0 0 0 30 2.505H10ZM28.75 17.5h-17.5V5.005h7.5V8.76a1.25 1.25 0 0 0 2.5 0V5.005h2.5v6.24a1.25 1.25 0 0 0 2.5 0v-6.24h2.5V17.5Zm-17.5 3.75V20h17.5v1.25a2.5 2.5 0 0 1-2.5 2.5h-2.505a1.25 1.25 0 0 0-1.25 1.25v7.5a2.497 2.497 0 1 1-4.995 0V25a1.25 1.25 0 0 0-1.25-1.25h-2.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
  </div>
  <h2>CSS</h2>
`;
  }
  if (activeQuizState.title === "JavaScript") {
    quizOptionTitle.innerHTML = `
  <div class="icon-background javascript">
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40"><path fill="#306AFF" d="M21.25 18.75A3.75 3.75 0 0 1 25 15h3.75a1.25 1.25 0 0 1 0 2.5H25a1.25 1.25 0 0 0-1.25 1.25V20A1.25 1.25 0 0 0 25 21.25h1.25A3.75 3.75 0 0 1 30 25v1.25A3.75 3.75 0 0 1 26.25 30H22.5a1.25 1.25 0 0 1 0-2.5h3.75a1.25 1.25 0 0 0 1.25-1.25V25a1.25 1.25 0 0 0-1.25-1.25H25A3.75 3.75 0 0 1 21.25 20v-1.25ZM20 16.25a1.25 1.25 0 0 0-2.5 0v10a1.25 1.25 0 0 1-1.25 1.25h-2.5a1.25 1.25 0 0 0 0 2.5h2.5A3.75 3.75 0 0 0 20 26.25v-10Zm-15-5A6.25 6.25 0 0 1 11.25 5h17.5A6.25 6.25 0 0 1 35 11.25v17.5A6.25 6.25 0 0 1 28.75 35h-17.5A6.25 6.25 0 0 1 5 28.75v-17.5Zm6.25-3.75a3.75 3.75 0 0 0-3.75 3.75v17.5a3.75 3.75 0 0 0 3.75 3.75h17.5a3.75 3.75 0 0 0 3.75-3.75v-17.5a3.75 3.75 0 0 0-3.75-3.75h-17.5Z"/></svg>
  </div>
  <h2>JavaScript</h2>
`;
  }
  if (activeQuizState.title === "Accessibility") {
    quizOptionTitle.innerHTML = `
  <div class="icon-background accessibility">
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40"><path fill="#A729F5" d="M16.875 8.125a3.125 3.125 0 1 1 6.25 0 3.125 3.125 0 0 1-6.25 0ZM20 2.5a5.625 5.625 0 0 0-5.475 6.915l-4.03-1.625a4 4 0 0 0-5.19 2.18 3.95 3.95 0 0 0 2.175 5.175l5.02 2.027v5.96l-4.532 8.525a3.98 3.98 0 0 0 7.024 3.738L20 25.975l5.01 9.42a3.978 3.978 0 0 0 7.025-3.735L27.5 23.13v-5.957l5.02-2.028a3.95 3.95 0 0 0 2.175-5.175 4 4 0 0 0-5.19-2.183l-4.027 1.628A5.626 5.626 0 0 0 20 2.5ZM7.618 10.922a1.5 1.5 0 0 1 1.94-.817l8.57 3.463a5 5 0 0 0 3.744 0l8.57-3.463a1.5 1.5 0 0 1 1.94.817 1.45 1.45 0 0 1-.8 1.905l-5.02 2.025A2.5 2.5 0 0 0 25 17.175v5.957c0 .41.1.814.293 1.175l4.535 8.528a1.48 1.48 0 0 1-2.61 1.39l-5.01-9.425a2.5 2.5 0 0 0-4.415 0l-5.008 9.418a1.477 1.477 0 1 1-2.61-1.388l4.532-8.525A2.5 2.5 0 0 0 15 23.133v-5.96a2.5 2.5 0 0 0-1.563-2.318l-5.02-2.03a1.45 1.45 0 0 1-.8-1.902Z"/></svg>
  </div>
  <h2>Accessibility</h2>
`;
  }
  updateProgressBar();

  // show first set of questions
  changeQuestionLogic();
}

function changeQuestionLogic() {
  if (currentQuestionNumber > 10) {
    // show end screen and end the game
    showQuizEndScreen();
  }
  // Reset the user input values
  submittedAnswer = null;
  userInputtedAnswerUI = null;
  userInputtedAnswerValue = null;

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

    changeQuestionUI();
  }
}

function changeQuestionUI() {
  // Enable pointer events again
  quizAnswersContainer.style.pointerEvents = "auto";

  // Change NextQuestion/SubmitAnswer Button text back to submit

  submitAnswerButton.textContent = "Submit Answer";

  // remove incorrect / incorrect classes from possible answers. Also remove active class

  quizAnswers.forEach((answer) => {
    answer.classList.remove("question-incorrect");
    answer.classList.remove("question-correct");
    answer.classList.remove("active");

    //remove icons
    // hide all error icons
    document.querySelectorAll(".icon-error").forEach((icon) => {
      icon.style.display = "none";
    });

    // hide all correct icons
    document.querySelectorAll(".icon-correct").forEach((icon) => {
      icon.style.display = "none";
    });
  });

  //display answers for current question
  quizQuestion.textContent = activeQuizState.questions[0].question;

  quizAnswerstitle.forEach((answer, index) => {
    // loop through each question html element and show the corresponding question based on the index

    answer.textContent = activeQuizState.questions[0].options[index];
  });

  //update the progress bar
  updateProgressBar();
  //update question number UI

  quizQuestionNumberUI.textContent = `Question ${currentQuestionNumber} of  10 `;
}

// highlight the selected answer chosen by the UI
function showSelectedAnswer(answer) {
  quizAnswers.forEach((answer) => {
    answer.classList.remove("active");
  });
  answer.classList.add("active");
}

//Check the users answer and show the correct / incorrect answer in UI
function checkAnswer() {
  //if there is no user selected value when the submit button is pressed then end the function

  if (
    userInputtedAnswerValue === undefined ||
    userInputtedAnswerValue === null
  ) {
    displayErrorMessageUI();
    return;
  }

  //hide error message when the user input isnt null

  hideErrorMessageUI();

  //disable pointer events after submitting question - this disables the user from being able to change their answer if it's wrong

  quizAnswersContainer.style.pointerEvents = "none";
  // prompt user to go to next question by changing text of submit button

  submitAnswerButton.textContent = "Next Question";

  //make the submitted value the value that the user selected

  submittedAnswer = userInputtedAnswerValue;

  // check if answer is incorrect

  if (userInputtedAnswerValue !== activeQuizState.answer) {
    // apply incorrect classes to user input

    const incorrectIcon = userInputtedAnswerUI.querySelector(".icon-error");
    incorrectIcon.style.display = "block";
    userInputtedAnswerUI.classList.add("question-incorrect");

    // show what should be the correct answer

    return;
  } else {
    //apply correct class to user input

    const correctIcon = userInputtedAnswerUI.querySelector(".icon-correct");
    correctIcon.style.display = "block";
    userInputtedAnswerUI.classList.add("question-correct");

    //add one to the quiz score

    quizScore++;
  }
}

function updateProgressBar() {
  //update the width of the progrss bar based on the current question

  progressBarFill.style.width = `${(currentQuestionNumber / 10) * 100}%`;
}

// quiz error message

function displayErrorMessageUI() {
  questionErrorMessage.style.display = "flex";
}

function hideErrorMessageUI() {
  questionErrorMessage.style.display = "none";
}

// finish the quiz

function showQuizEndScreen() {
  quizUIScreen.classList.remove("active");
  gameCompletedUI.classList.add("active");

  //show score card title
  scoreCardTitle.textContent = activeQuizState.title;
  // show final score
  finalScoreText.innerHTML = `<span>${quizScore}</span> out of 10`;
}

//update backgroundImage sources

function updateSources(theme) {
  const sources = backgroundImage.querySelectorAll("source");
  sources.forEach((source) => {
    source.srcset = source.srcset.replace(/(light|dark)/, theme);
  });
  const img = backgroundImage.querySelector("img");
  img.src = img.src.replace(/(light|dark)/, theme);
}
