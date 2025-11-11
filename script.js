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

const quizAnswersContainer = document.querySelector(".quiz-list");

quizAnswersContainer.style.pointEvents = "none";

/* quiz options ui */
const quizQuestion = document.querySelector(".current-quiz-question");

const quizAnswers = document.querySelectorAll(".quiz-list > li");

const quizAnswerstitle = document.querySelectorAll(".quiz-answer-title");

/* next question button */
const submitAnswerButton = document.querySelector("#next-question-btn");

// const errorIcons = document.querySelectorAll(".icon-error");

// const correctIcons = document.querySelectorAll(".icon-correct");

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
  console.log(submittedAnswer);
  if (submittedAnswer === null) {
    // check answer of user
    checkAnswer();
  } else {
    // after checking answer then change the ui
    changeQuestionLogic();
  }
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

    // Reset the user input values

    userInputtedAnswerUI = null;
    userInputtedAnswerValue = null;

    //

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
  });

  quizQuestion.textContent = activeQuizState.questions[0].question;

  quizAnswerstitle.forEach((answer, index) => {
    // loop through each question html element and show the corresponding question based on the index

    answer.textContent = activeQuizState.questions[0].options[index];
  });
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
    return;
  }

  //disable pointer events when submitting question

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
    userInputtedAnswerUI.classList.add("question-correct");

    //add one to the quiz score

    quizScore++;
  }

  console.log(quizScore, "quiz score");
}
