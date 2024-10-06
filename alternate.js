const url = "https://opentdb.com/api.php?amount=30";
const div = document.getElementById("elements");
const scoreDisplay = document.getElementById("score");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");

let score = 0;
let currentQuestionIndex = 0;
let quizDataArray = [];

// Fetch quiz data using async/await
const fetchQuizData = async () => {
  try {
    const response = await fetch(url);
    const { results } = await response.json(); // Destructuring the result
    quizDataArray = results;
    renderQuestion(currentQuestionIndex);
    updateNavButtons();
  } catch (error) {
    console.error("Error fetching data", error);
  }
};
fetchQuizData();

// Render current question
const renderQuestion = (index) => {
  const { category, question, correct_answer, incorrect_answers } = quizDataArray[index];
  div.innerHTML = `
    <h3><strong>Category: ${category}</strong></h3>
    <div class="question">
      <p><strong>Question ${index + 1}:</strong> ${question}</p>
      <div class="answers">
        ${shuffleAnswers(correct_answer, incorrect_answers).map(answer => 
          `<button class="btn">${answer}</button>`).join('')}
      </div>
    </div>
  `;
  nextButton.disabled = true; // Disable next button initially
  addAnswerEventListeners(correct_answer); // Add event listeners for answers
};

// Shuffle answers and return array
const shuffleAnswers = (correct, incorrect) => {
  return [...incorrect, correct].sort(() => Math.random() - 0.5);
};

// Add event listeners to all answer buttons
const addAnswerEventListeners = (correctAnswer) => {
  const answerButtons = div.querySelectorAll(".btn");
  
  answerButtons.forEach(button => {
    button.addEventListener("click", (e) => handleAnswerSelection(e, correctAnswer, answerButtons));
  });
};

// Handle answer selection logic
const handleAnswerSelection = (e, correctAnswer, buttons) => {
  const selectedButton = e.target;
  const isCorrect = selectedButton.innerText === correctAnswer;
  
  disableAllButtons(buttons);
  
  if (isCorrect) {
    selectedButton.classList.add("correct");
    updateScore(1);
    nextButton.disabled = false; // Enable next button after correct answer
    displayFeedback("Correct!", "green");
  } else {
    selectedButton.classList.add("incorrect");
    displayFeedback("Incorrect!", "red");
  }
};


// Update score display
const updateScore = (points) => {
  score += points;
  scoreDisplay.innerText = `Score: ${score}`;
};

// Display feedback message
const displayFeedback = (message, color) => {
  const feedback = document.createElement('p');
  feedback.innerText = message;
  feedback.style.color = color;
  feedback.classList.add("feedback");
  div.appendChild(feedback);
  
  setTimeout(() => feedback.remove(), 2000); // Remove feedback after 2 seconds
};

// Handle next question
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < quizDataArray.length - 1) {
    currentQuestionIndex++;
    renderQuestion(currentQuestionIndex);
    updateNavButtons();
  }
});

// Handle previous question
prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion(currentQuestionIndex);
    updateNavButtons();
  }
});

// Update navigation button visibility
const updateNavButtons = () => {
  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = true; // Next is always disabled until correct answer is selected
};
