let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("result");
const questionCount = document.getElementById("question-count");
const progressBar = document.getElementById("progress-bar");
const timerDisplay = document.getElementById("timer");

fetch("quizquestion.json")
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .then(data => {
    questions = data;
    // Shuffle questions for bonus
    questions = shuffleArray(questions);
    showQuestion();
  })
  .catch(error => {
    console.error("Error fetching questions:", error);
    questionText.textContent = "Failed to load questions. Please try again.";
  });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 30;
  updateTimerDisplay();
  
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(-1); // -1 indicates time ran out
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Time: ${timeLeft}s`;
}

function showQuestion() {
  clearOptions();
  startTimer();
  
  questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  
  const q = questions[currentQuestionIndex];
  questionText.textContent = q.question;

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.onclick = () => {
      clearInterval(timer);
      checkAnswer(index);
    };
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestionIndex].answer;
  const options = optionsContainer.children;
  
  // Disable all options
  Array.from(options).forEach(btn => {
    btn.disabled = true;
  });
  
  // Highlight correct and incorrect answers
  if (selectedIndex >= 0) {
    options[selectedIndex].classList.add(selectedIndex === correctIndex ? "correct" : "incorrect");
  }
  options[correctIndex].classList.add("correct");
  
  // Update score if correct
  if (selectedIndex === correctIndex) {
    score++;
  }
  
  nextBtn.disabled = false;
}

function clearOptions() {
  optionsContainer.innerHTML = "";
  nextBtn.disabled = true;
  clearInterval(timer);
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.querySelector(".quiz-box").innerHTML = `
    <h2>Quiz Completed!</h2>
    <div id="result">Your score: ${score} / ${questions.length}</div>
    <button onclick="location.reload()">Try Again</button>
  `;
}