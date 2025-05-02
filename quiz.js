const subjectSelect = document.getElementById("subject-select");
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const choicesList = document.getElementById("choices-list");
const nextButton = document.getElementById("next-button");
const scoreDisplay = document.getElementById("score-display"); 

let currentQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0; 
let currentTotal = 0; 
let sessionCorrect = 0; 
let selectedOption = null;
let seenQuestions = [];

let totalCorrect = localStorage.getItem("totalCorrect") ? parseInt(localStorage.getItem("totalCorrect")) : 0; 
let totalQuestions = localStorage.getItem("totalQuestions") ? parseInt(localStorage.getItem("totalQuestions")) : 0; 

subjectSelect.addEventListener("change", function () {
  const selectedSubject = subjectSelect.value;

  fetch(`./questions/${selectedSubject}.json`)
    .then(response => response.json())
    .then(data => {
      currentQuestions = data.questions;
      currentQuestionIndex = 0;
      currentScore = 0; 
      sessionCorrect = 0;
      currentTotal = 0;
      selectedOption = null; 
      seenQuestions = []; 

      showQuestion();
      updateScoreDisplay();
    })
    .catch(error => {
      console.error("Error loading JSON:", error);
      alert("Failed to load questions. Please try again.");
    });
});

function showQuestion() {
  if (currentQuestions.length === 0) return;

  questionContainer.style.display = "block";

  let question;
  if (seenQuestions.length < currentQuestions.length) {
    do {
      const randomIndex = Math.floor(Math.random() * currentQuestions.length);
      question = currentQuestions[randomIndex];
    } while (seenQuestions.includes(question));
    
    seenQuestions.push(question);
  } else {
    seenQuestions = [];
    showQuestion();
    return;
  }

  questionText.textContent = question.question;
  choicesList.innerHTML = "";

  const randomizedOptions = shuffleArray(question.options);

  selectedOption = null;

  randomizedOptions.forEach(option => {
    const listItem = document.createElement("li");
    listItem.textContent = option;
    listItem.style.cursor = "pointer";
    listItem.style.padding = "10px";
    listItem.style.border = "2px transparent";
    listItem.style.marginBottom = "5px";

    listItem.addEventListener("click", () => {
      if (selectedOption) return; 

      Array.from(choicesList.children).forEach(child => {
        child.style.border = "2px transparent";
        child.style.backgroundColor = "transparent";
        child.style.cursor = "not-allowed"; 
      });

      listItem.style.border = "2px solid #61e161"; 
      listItem.style.backgroundColor = "rgb(230, 255, 230)";

      selectedOption = option;

      const correctAnswer = question.correct_answer;
      Array.from(choicesList.children).forEach(child => {
        if (child.textContent === selectedOption) {
          if (selectedOption !== correctAnswer) {
            child.style.border = "2px solid #e16161";
            child.style.backgroundColor = "rgb(255, 230, 230)";
          }
        }
        if (child.textContent === correctAnswer && child.textContent !== selectedOption) {
          child.style.backgroundColor = "rgb(230, 255, 230)";
          child.style.border = "2px solid #61e161";
        }
      });

      nextButton.disabled = false;

      if (selectedOption === correctAnswer) {
        sessionCorrect++;
        totalCorrect++;
      }

      currentTotal++;

      nextButton.disabled = false;
    });

    choicesList.appendChild(listItem);
  });

  nextButton.disabled = true;
  nextButton.style.display = "inline-block";
}

nextButton.addEventListener("click", function () {
  if (!selectedOption) {
    alert("You must select an answer before proceeding.");
    return;
  }

  totalQuestions++; 

  localStorage.setItem("totalCorrect", totalCorrect);
  localStorage.setItem("totalQuestions", totalQuestions);

  if (seenQuestions.length < currentQuestions.length) {
    showQuestion();
  } else {
    alert("Quiz complete! Your score: " + sessionCorrect + "/" + currentTotal);
    questionContainer.style.display = "none"; 
  }

  updateScoreDisplay(); 
});

function updateScoreDisplay() {
    const scoreDisplayElement = document.getElementById("score-display");
    const overallPercentage = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(2) : 0;

    scoreDisplayElement.innerHTML = `
      W - L<br>
      ${sessionCorrect} - ${currentTotal-sessionCorrect}<br>
      ${totalCorrect} - ${totalQuestions-totalCorrect}<br>
      ${overallPercentage}%
    `;
  }
  
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener("DOMContentLoaded", function() {
  updateScoreDisplay();
});
