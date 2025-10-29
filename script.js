//
// DOM ELEMENTS
//
const ThemeToggleCircle = document.querySelector(".toggle-circle");
const ThemeToggleBtn = document.querySelector(".toggle-theme-btn");

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
// FUNCTIONS
//
function enableDarkMode() {
  console.log("enable dark mode");
  document.body.classList.add("dark-mode");
  ThemeToggleCircle.classList.add("dark-mode");
  localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
  console.log("disable dark mode");
  document.body.classList.remove("dark-mode");
  ThemeToggleCircle.classList.remove("dark-mode");
  localStorage.setItem("darkMode", null);
}
