const url = "https://opentdb.com/api.php?amount=30";
const elementsDiv = document.getElementById("elements");
const scoreDisplay = document.getElementById("score");
let score = 0;

// IIFE to fetch quiz data and start the app immediately
(async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderQuiz(data.results);
    } catch (error) {
        console.error("Error fetching data", error);
    }
})();

const renderQuiz = (questions) => {
    elementsDiv.innerHTML = "";  // Clear previous content

    questions.forEach((question, index) => {
        const questionContainer = document.createElement("div");
        questionContainer.innerHTML = `
            <h3>Category: ${question.category}</h3>
            <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
        `;

        const shuffledAnswers = shuffleAnswers([...question.incorrect_answers, question.correct_answer]);

        shuffledAnswers.forEach(answer => {
            const button = createAnswerButton(answer, question.correct_answer, questionContainer);
            questionContainer.appendChild(button);
        });

        elementsDiv.appendChild(questionContainer);
    });
};

const createAnswerButton = (answer, correctAnswer, questionContainer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.classList.add("btn");

    button.addEventListener("click", () => handleAnswerClick(button, correctAnswer, questionContainer));

    return button;
};

const handleAnswerClick = (button, correctAnswer, questionContainer) => {
    const existingFeedback = questionContainer.querySelector(".feedback");
    if (existingFeedback) existingFeedback.remove();  // Remove any previous feedback

    const feedback = document.createElement("p");
    feedback.classList.add("feedback");

    if (button.innerText === correctAnswer) {
        button.classList.add("correct");
        feedback.innerText = "Correct!";
        feedback.style.color = "green";
        score++;
    } else {
        button.classList.add("incorrect");
        feedback.innerText = `Incorrect! The correct answer was: ${correctAnswer}`;
        feedback.style.color = "red";
    }

    questionContainer.appendChild(feedback);
    updateScore();
};

const shuffleAnswers = (answers) => answers.sort(() => Math.random() - 0.5);

const updateScore = () => {
    scoreDisplay.innerText = `Score: ${score}`;
};
