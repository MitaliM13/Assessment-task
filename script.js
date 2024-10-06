const url = "https://opentdb.com/api.php?amount=30"
const div = document.getElementById("elements")
const scoreDisplay = document.getElementById("score")
let score = 0
async function quizData() {
    try {
        const getData = await fetch(url)
        const data = await getData.json()
        
        displayData(data)
    } catch (error) {
        console.error( `Error fetching data`,error)
    }
}
quizData()

function displayData(data) {
    div.innerHTML = ""

    data.results.forEach((item, index) => {
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
    });
}

const correct = (button, correctAns, questionDiv) => {
    const isCorrect = questionDiv.querySelector(".feedback")
    if(isCorrect){
        isCorrect.remove()
    }

    const feedback = document.createElement('p')
    feedback.classList.add("feedback")

    if(button.innerText === correctAns){
        button.classList.add("correct")
        feedback.innerHTML = "Correct!"
        feedback.style.color = "green"
        score++
    } else {
        button.classList.add("incorrect")
        feedback.innerHTML = "Incorrect!"
        feedback.style.color = "red"
    }

    questionDiv.appendChild(feedback)
    upDateScore()
}

function upDateScore(){
    scoreDisplay.innerText = `Score: ${score}`
}