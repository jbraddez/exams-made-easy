// Get references to HTML elements
const subjectSelect = document.getElementById("subject-select");
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const choicesList = document.getElementById("choices-list");
const nextButton = document.getElementById("next-button");
const scoreDisplay = document.getElementById("score-display"); 

let currentQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0; 
let currentTotal = 0; // Tracks total questions in the current session
let sessionCorrect = 0; // Correct answers in the current session
let selectedOption = null; // Tracks the user's final selection for the current question
let seenQuestions = []; // Keeps track of questions already answered

// Load the overall score from local storage (persisted across sessions)
let totalCorrect = localStorage.getItem("totalCorrect") ? parseInt(localStorage.getItem("totalCorrect")) : 0; // Total correct answers across all sessions
let totalQuestions = localStorage.getItem("totalQuestions") ? parseInt(localStorage.getItem("totalQuestions")) : 0; // Total questions across all sessions

// Load JSON data for the selected subject
subjectSelect.addEventListener("change", function () {
  const selectedSubject = subjectSelect.value;

  // Fetch the questions JSON for the selected subject
  fetch(`./questions/${selectedSubject}.json`)
    .then(response => response.json())
    .then(data => {
      currentQuestions = data.questions;
      currentQuestionIndex = 0;
      currentScore = 0; // Reset the session score
      sessionCorrect = 0; // Reset session correct answers
      currentTotal = 0; // Reset session total questions
      selectedOption = null; // Reset selection for the first question
      seenQuestions = []; // Reset the seen questions list

      // Display the first question
      showQuestion();
      updateScoreDisplay();
    })
    .catch(error => {
      console.error("Error loading JSON:", error);
      alert("Failed to load questions. Please try again.");
    });
});

// Display the current question
function showQuestion() {
  if (currentQuestions.length === 0) return;

  // Show the question container
  questionContainer.style.display = "block";

  // Pick a random question that hasn't been seen yet
  let question;
  if (seenQuestions.length < currentQuestions.length) {
    do {
      const randomIndex = Math.floor(Math.random() * currentQuestions.length);
      question = currentQuestions[randomIndex];
    } while (seenQuestions.includes(question));
    
    seenQuestions.push(question); // Mark this question as seen
  } else {
    // All questions have been seen, reset
    seenQuestions = [];
    showQuestion();
    return;
  }

  // Update the question and choices
  questionText.textContent = question.question;
  choicesList.innerHTML = "";

  // Randomize the options order
  const randomizedOptions = shuffleArray(question.options);

  // Reset selection for the current question
  selectedOption = null;

  // Add choices to the list
  randomizedOptions.forEach(option => {
    const listItem = document.createElement("li");
    listItem.textContent = option;
    listItem.style.cursor = "pointer";
    listItem.style.padding = "10px";
    listItem.style.border = "2px transparent";
    listItem.style.marginBottom = "5px";

    // Add click event to select only one option and show selection
    listItem.addEventListener("click", () => {
      if (selectedOption) return; // If an option has already been selected, do nothing

      // Remove borders from all options and disable further clicks
      Array.from(choicesList.children).forEach(child => {
        child.style.border = "2px transparent";
        child.style.backgroundColor = "transparent";
        child.style.cursor = "not-allowed"; // Disable further clicks
      });

      // Highlight the selected option
      listItem.style.border = "2px solid #61e161"; // Initially set the border to green
      listItem.style.backgroundColor = "rgb(230, 255, 230)"; // Highlight the selected option in green

      // Update the selected option
      selectedOption = option;

      // Check if the selected option is correct
      const correctAnswer = question.correct_answer;
      Array.from(choicesList.children).forEach(child => {
        if (child.textContent === selectedOption) {
          // If answer is incorrect, highlight red
          if (selectedOption !== correctAnswer) {
            child.style.border = "2px solid #e16161"; // Red border for incorrect answer
            child.style.backgroundColor = "rgb(255, 230, 230)";
          }
        }
        if (child.textContent === correctAnswer && child.textContent !== selectedOption) {
          // Highlight the correct answer in green
          child.style.backgroundColor = "rgb(230, 255, 230)";
          child.style.border = "2px solid #61e161";
        }
      });

      // Enable the "Next Question" button after an answer is selected
      nextButton.disabled = false;

      // If the selected option is correct, increment the session score and total correct score
      if (selectedOption === correctAnswer) {
        sessionCorrect++; // Increment the session correct answers
        totalCorrect++; // Increment the total correct answers across sessions
      }

      // Increment the total number of questions answered in this session
      currentTotal++;

      // Enable the "Next Question" button after an answer is selected
      nextButton.disabled = false;
    });

    choicesList.appendChild(listItem);
  });

  // Disable the "Next Question" button until an option is selected
  nextButton.disabled = true;

  // Show or hide the "Next Question" button
  nextButton.style.display = "inline-block";
}

// Handle the "Next Question" button click
nextButton.addEventListener("click", function () {
  if (!selectedOption) {
    alert("You must select an answer before proceeding.");
    return;
  }

  // Increment total questions by 1 for each question passed
  totalQuestions++; // Increment total questions for each question passed

  // Save the updated overall totals to local storage
  localStorage.setItem("totalCorrect", totalCorrect);
  localStorage.setItem("totalQuestions", totalQuestions);

  // Move to the next question or end the quiz
  if (seenQuestions.length < currentQuestions.length) {
    showQuestion();
  } else {
    alert("Quiz complete! Your score: " + sessionCorrect + "/" + currentTotal);
    questionContainer.style.display = "none"; // Hide the quiz after it's done
  }

  updateScoreDisplay(); // Update the displayed score
});

// Update the score display (on page load and after each question)
function updateScoreDisplay() {
    if (!scoreDisplay) {
      const scoreElement = document.createElement("p");
      scoreElement.id = "score-display";
      scoreElement.style.marginTop = "20px";
      questionContainer.appendChild(scoreElement);
    }
  
    const scoreDisplayElement = document.getElementById("score-display");
  
    // Calculate the overall percentage
    const overallPercentage = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(2) : 0;
  
    // Display the current score on one line and the total score on another line
    scoreDisplayElement.innerHTML = `
      Current score: ${sessionCorrect} / ${currentTotal}<br>
      Total score: ${totalCorrect} / ${totalQuestions} (${overallPercentage}%)
    `;
  }
  

// Helper function to shuffle an array (for randomizing options)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// On page load, display the score and percentage
document.addEventListener("DOMContentLoaded", function() {
  updateScoreDisplay(); // Update the score display when the page loads
});
