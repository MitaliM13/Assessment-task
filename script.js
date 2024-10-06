const url = "https://opentdb.com/api.php?amount=30"
const div = document.getElementById("elements")
const scoreDisplay = document.getElementById("score")
const nextButton = document.getElementById("next")
const prevButton = document.getElementById("prev")
let score = 0
let currentQuestionIndex = 0
let quizDataArray = []

async function quizData() {
    try {
        const getData = await fetch(url)
        const data = await getData.json()

        quizDataArray = data.results // Store the data for future navigation
        displayQuestion(currentQuestionIndex) // Display the first question
        updateNavButtons() // Update navigation buttons visibility

    } catch (error) {
        console.error(`Error fetching data`, error)
    }
}
quizData()

// Function to display the current question based on index
function displayQuestion(index) {
    const item = quizDataArray[index]
    div.innerHTML = ""

    const category = document.createElement("h3")
    category.innerHTML = `<strong>Category: ${item.category}</strong>`
    div.appendChild(category)

    const questionDiv = document.createElement("div")
    questionDiv.innerHTML = `<p><strong>Question ${index + 1}:</strong> ${item.question} </p>`

    let answers = [...item.incorrect_answers]
    answers.push(item.correct_answer)

    answers = answers.sort(() => Math.random() - 0.5)

    answers.forEach(answer => {
        const optionButton = document.createElement("button")
        optionButton.innerText = answer
        optionButton.classList.add("btn")

        optionButton.addEventListener('click', () => {
            correct(optionButton, item.correct_answer, questionDiv)
        })

        questionDiv.appendChild(optionButton)
    })

    div.appendChild(questionDiv)

    // Disable "Next" button until correct answer is selected
    nextButton.disabled = true
}

// Check if answer is correct and update the score
const correct = (button, correctAns, questionDiv) => {
    const isCorrect = questionDiv.querySelector(".feedback")
    if (isCorrect) {
        isCorrect.remove()
    }

    const feedback = document.createElement('p')
    feedback.classList.add("feedback")

    if (button.innerText === correctAns) {
        button.classList.add("correct")
        feedback.innerHTML = "Correct!"
        feedback.style.color = "green"
        score++

        // Enable the "Next" button only after selecting the correct answer
        nextButton.disabled = false
    } else {
        button.classList.add("incorrect")
        feedback.innerHTML = "Incorrect!"
        feedback.style.color = "red"
    }

    questionDiv.appendChild(feedback)
    upDateScore()

    setTimeout(() => {
        feedback.remove() // Optionally remove the feedback after a timeout
    }, 2000)

}

// Update score display
function upDateScore() {
    scoreDisplay.innerText = `Score: ${score}`
}

// Next question handler
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < quizDataArray.length - 1) {
        currentQuestionIndex++
        displayQuestion(currentQuestionIndex)
        updateNavButtons()
    }
})

// Previous question handler
prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--
        displayQuestion(currentQuestionIndex)
        updateNavButtons()
    }
})

// Function to enable/disable navigation buttons based on current question
function updateNavButtons() {
    prevButton.disabled = currentQuestionIndex === 0
    nextButton.disabled = true // Next button disabled initially until correct answer is selected
}
