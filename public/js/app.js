var min = document.querySelector('.min')
var max = document.querySelector('.max')
var minMinusButton = document.getElementById('minMinusButton')
var minPlusButton = document.getElementById('minPlusButton')
var maxMinusButton = document.getElementById('maxMinusButton')
var maxPlusButton = document.getElementById('maxPlusButton')
var minValue = document.getElementById('minValue')
var maxValue = document.getElementById('maxValue')
var msg = document.querySelector('.msg')

var randomNumber = Math.floor(Math.random() * 100) + 1;

var guesses = document.querySelector('.guesses')

var count = []
var answer = []

for(let i=0;i<10;i++){
  count[i] = document.querySelector('.count' + (i+1))
  answer[i] = document.querySelector('.answer' + (i+1))
}

var lastResult = document.querySelector('.lastResult')

var guessSubmit = document.querySelector('.guessSubmit')
var guessField = document.querySelector('.guessField')

var guessCount = 1
var resetButton
var startButton = document.querySelector('.start')

startButton.addEventListener('click', resetGame)

guessSubmit.addEventListener('click', checkGuess)

minMinusButton.addEventListener('click', () => {
  DisableGuessField(true)
  updateMinMax('min', Number(minValue.textContent) + Number(minMinusButton.textContent))
})

minPlusButton.addEventListener('click', () => {
  DisableGuessField(true)
  if (checkMinValidation()) {
    updateMinMax('min', Number(minValue.textContent) + Number(minPlusButton.textContent))
  }
})

maxMinusButton.addEventListener('click', () => {
  DisableGuessField(true)
  if (checkMaxValidation()) {
    updateMinMax('max', Number(maxValue.textContent) + Number(maxMinusButton.textContent))
  }
})

maxPlusButton.addEventListener('click', () => {
  DisableGuessField(true)
  updateMinMax('max', Number(maxValue.textContent) + Number(maxPlusButton.textContent))
})

function DisableGuessField(isDisplay) {
  guessField.disabled = isDisplay
  guessSubmit.disabled = isDisplay
}

function checkMinValidation() {
  if (Number(minValue.textContent) > 40 ) {
    setTimeout(() => {
      msg.textContent = ''
    }, 2000)
    msg.textContent = 'Please choose smaller number for Min.'
    return false
  } else {
    return true
  }
}

function checkMaxValidation() {
  if (Number(maxValue.textContent) < Number(minValue.textContent) + 11) {
    setTimeout(() => {
      msg.textContent = ''
    }, 2000)
    msg.textContent = 'Please choose larger number for Max.'
    return false
  } else {
    return true
  }
}

function updateMinMax(target, number) {
  if(target === 'min') {
    minValue.textContent = number
    min.textContent = number
  } else if (target === 'max') {
    maxValue.textContent = number
    max.textContent = number
  }
}

function checkGuess() {
  let userGuess = Number(guessField.value)
  if (guessCount === 1) {
    guesses.textContent = 'Previous guesses: '
  }
  count[guessCount - 1].textContent = guessCount + 'st'
  answer[guessCount-1].textContent = userGuess
  // guesses.textContent += userGuess + ' '

  if (userGuess === randomNumber) {
    lastResult.textContent = 'Congratulations! You got it right!'
    lastResult.style.backgroundColor = 'green'
    setGameOver();
  } else if (guessCount === 10) {
    lastResult.textContent = '!!!GAME OVER!!!'
    setGameOver();
  } else {
    lastResult.textContent = 'Wrong!'
    lastResult.style.color = 'white'
    lastResult.style.backgroundColor = 'red'
    if (userGuess < randomNumber) {
      setTimeout(() => {
        msg.textContent = ''
      }, 2000)
      msg.textContent = 'Last guess was too low!'
    } else if (userGuess > randomNumber) {
      setTimeout(() => {
        msg.textContent = ''
      }, 2000)
      msg.textContent = 'Last guess was too high!'
    }
  }

  guessCount++;
  guessField.value = '';
  guessField.focus();
}

function setGameOver() {
  guessField.disabled = true;
  guessSubmit.disabled = true;
  // resetButton = document.createElement('button');
  startButton.textContent = 'Start New Game'
  // document.body.append(resetButton);
  // startButton.addEventListener('click', resetGame);
}

function resetGame() {
  guessCount = 1

  // var reset = document.querySelectorAll('.result p')

  for (let i = 0; i < count.length; i++) {
    count[i].textContent = ''
    answer[i].textContent = ''
  }

  // resetButton.parentNode.removeChild(resetButton);
  startButton.textContent = 'Start'

  DisableGuessField(false)
  guessField.value = ''
  guessField.focus()

  lastResult.style.backgroundColor = 'white'
  lastResult.textContent = ''
  // randomNumber = Math.floor(Math.random() * 100) + 1;
  console.log(Number(minValue.textContent))
  console.log(Number(maxValue.textContent))
  randomNumber = Math.floor(Math.random() * (Number(maxValue.textContent) - Number(minValue.textContent)) + Number(minValue.textContent) + 1)
  console.log(randomNumber)
}
