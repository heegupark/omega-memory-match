var gameCards = document.getElementById('gameCards')
var firstCardClicked
var secondCardClicked
var firstCardClasses
var secondCardClasses
var maxMatches
var matches = 0

var cardFronts

// level setting
var level = 'beginner'
var iMax
var jMax
var kMax
var cardMargin = 0.1
var card = document.querySelectorAll('.card')

/* modal */
var modal = document.querySelector('.modal')

/* win modal */
var modalWin = document.querySelector('.modal-win')
var playAgainBtn = document.querySelector('.play-again')

/* stats */
var attempts = 0
var gamesPlayed = 0
var accuracy = 0

var gamePlayedObjTop = document.getElementById('games-played-top')
var gamePlayedObjSide = document.getElementById('games-played-side')
var attemptsObjTop = document.getElementById('attempts-top')
var accuracyObjTop = document.getElementById('accuracy-top')
var attemptsObjSide = document.getElementById('attempts-side')
var accuracyObjSide = document.getElementById('accuracy-side')

/* image loading */
var images = []
var imageCount = 12

var theme = ''

var changedFontColor = 'crimson'
var changedFontWeight = '800'

/* sound */
var bgMusic
var cardMouseOverSound
var successSound
var failSound
var cardFlipSound
var clickSound
var isSoundOn = false

// level selection button
var modalLevel = document.querySelector('.modal-level')
var levelBtn = document.querySelectorAll('.level-btn')
var levelChangeBtn = document.querySelectorAll('.level-change-btn')

for (var i = 0; i < levelBtn.length; i++) {
  levelBtn[i].addEventListener('click', function (e) {
    if (isSoundOn) {
      clickSound.play()
    }
    level = e.target.textContent.toLowerCase()
    modal.style.display = 'none'
    modalLevel.style.display = 'none'
    modalTheme.style.display = 'none'
    resetGame()
    startGame(theme)
  })
}

for (var i = 0; i < levelChangeBtn.length; i++) {
  levelChangeBtn[i].addEventListener('click', function () {
    modalWin.style.display = 'none'
    modal.style.display = 'block'
    modalLevel.style.display = 'block'
    modalTheme.style.display = 'none'
  })
}


// playing sounds can be initiatized after user's interaction
var isClicked = false

document.body.addEventListener('click', function () {
  var button = document.querySelectorAll('button')

  isClicked = true
  if (isClicked) {
    for (var i = 0; i < button.length; i++) {
      button[i].addEventListener('mouseover', function () {
        if (isSoundOn) {
          cardMouseOverSound.play()
        }
      })
    }
  }
})

/* theme selection */
var modalTheme = document.querySelector('.modal-theme')
var themeBtn = document.querySelectorAll('.theme-btn')
var themeChangeBtn = document.querySelectorAll('.theme-change-btn')

for (var i = 0; i < themeBtn.length; i++) {
  themeBtn[i].addEventListener('click', function (e) {
    if (isSoundOn) {
      clickSound.play()
    }
    theme = e.target.textContent.toLowerCase()
    modal.style.display = 'block'
    modalTheme.style.display = 'none'
    modalLevel.style.display = 'block'
    switch (theme) {
      case 'vangogh':
        document.body.style.backgroundImage = 'url(img/background-van.jpg)'
        break;
      case 'graffiti':
        document.body.style.backgroundImage = 'url(img/background-gra.jpg)'
        break;
      case 'picasso':
        document.body.style.backgroundImage = 'url(img/background-pic.jpg)'
        break;
    }
  })
}

for (var i = 0; i < themeChangeBtn.length; i++) {
  themeChangeBtn[i].addEventListener('click', function () {
    modalWin.style.display = 'none'
    modal.style.display = 'block'
    modalTheme.style.display = 'block'
  })
}

// Play
playAgainBtn.addEventListener('click', function () {
  playAgain()
})

function playAgain() {
  if (isSoundOn) {
    clickSound.play()
  }
  resetGame()
  startGame(theme)
  modal.style.display = "none"
}

function startGame(theme) {
  dynamicCreateCard(level)

  if (isSoundOn) {
    bgMusic.play()
  }

  setImages(theme)
}

function resetGame() {
  matches = 0
  attempts = 0
  accuracy = 0
  // gamesPlayed++
  updateStats()
}

function updateStats() {
  // Top
  displayStats(gamePlayedObjTop, gamesPlayed, changedFontColor)
  displayStats(attemptsObjTop, attempts, changedFontColor)
  displayStats(accuracyObjTop, calculateAccuracy(attempts, matches) + ' %', 'orange')
  // Side
  displayStats(gamePlayedObjSide, gamesPlayed, changedFontColor)
  displayStats(attemptsObjSide, attempts, changedFontColor)
  displayStats(accuracyObjSide, calculateAccuracy(attempts, matches) + ' %', 'orange')

}

// Card playing
gameCards.addEventListener('click', handleClick)

function handleClick(event) {
  if (event.target.className.indexOf("card-back") === -1) {
    return;
  }

  if (!firstCardClicked) {
    if (isSoundOn) {
      cardFlipSound.play()
    }
    event.target.className += ' hidden'
    firstCardClicked = event.target
    firstCardClasses = firstCardClicked.previousElementSibling.className

  } else {
    event.target.className += ' hidden'
    secondCardClicked = event.target
    secondCardClasses = secondCardClicked.previousElementSibling.className

    // gameCards.removeEventListener('click', handleClick)

    if (firstCardClasses === secondCardClasses) {
      if (isSoundOn) {
        successSound.play()
      }
      matches++
      if (matches == maxMatches) {
        gamesPlayed++
        modal.style.display = 'block'
        modalWin.style.display = 'block'
      }
      firstCardClicked = null
      secondCardClicked = null
      attempts++
      updateStats()
      gameCards.addEventListener('click', handleClick)
    } else {
      if (isSoundOn) {
        failSound.play()
      }

      gameCards.removeEventListener('click', handleClick)

      setTimeout(function () {
        if (firstCardClicked.className.includes('hidden')) {
          firstCardClicked.classList.remove('hidden')
          firstCardClicked = null
        }
        if (secondCardClicked.className.includes('hidden')) {
          secondCardClicked.classList.remove('hidden')
          secondCardClicked = null
        }
        gameCards.addEventListener('click', handleClick)
      }, 500)

      attempts++
    }
    displayStats(attemptsObjTop, attempts, changedFontColor)
    displayStats(accuracyObjTop, calculateAccuracy(attempts, matches) + ' %', changedFontColor)
    displayStats(attemptsObjSide, attempts, changedFontColor)
    displayStats(accuracyObjSide, calculateAccuracy(attempts, matches) + ' %', changedFontColor)

  }
}

function setImages(theme) {
  images = []
  var imgStr = ''

  switch (theme) {
    case 'vangogh':
      imgStr = 'img-van-'
      break;
    case 'graffiti':
      imgStr = 'img-gra-'
      break;
    case 'picasso':
      imgStr = 'img-pic-'
      break;
  }

  for (var i = 1; i <= imageCount; i++) {
    images.push(imgStr + i)
  }

  shuffle(images)

  cardFronts = document.querySelectorAll('.card-front')

  for (var k = 0; k < kMax; k++) {
    cardFronts[k].classList.add('img-' + k)
    cardFronts[k].style.backgroundImage = 'url(img/' + images[k] + '.gif)'
    cardFronts[k + kMax].classList.add('img-' + k)
    cardFronts[k + kMax].style.backgroundImage = 'url(img/' + images[k] + '.gif)'
  }

  for (let i = cardFronts.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    var temp1 = cardFronts[i].className
    var temp2 = cardFronts[i].style.backgroundImage
    cardFronts[i].className = cardFronts[j].className
    cardFronts[i].style.backgroundImage = cardFronts[j].style.backgroundImage

    cardFronts[j].className = temp1
    cardFronts[j].style.backgroundImage = temp2
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function setLevel(level) {
  switch (level) {
    case 'beginner':
      iMax = 2
      jMax = 2
      kMax = 2
      maxMatches = kMax
      cardMargin = 4
      break;
    case 'easy':
      iMax = 3
      jMax = 2
      kMax = 3
      maxMatches = kMax
      cardMargin = 4
      break;
    case 'intermediate':
      iMax = 4
      jMax = 2
      kMax = 4
      maxMatches = kMax
      cardMargin = 3
      break;
    case 'hard':
      iMax = 4
      jMax = 3
      kMax = 6
      maxMatches = kMax
      cardMargin = 1
      break;
    case 'expert':
      iMax = 6
      jMax = 3
      kMax = 9
      maxMatches = kMax
      cardMargin = 0.1
      break;
    default:
      iMax = 6
      jMax = 3
      kMax = 9
      maxMatches = kMax
      break;
  }
}

function dynamicCreateCard(level) {

  var child = gameCards.lastElementChild;
  while (child) {
    gameCards.removeChild(child);
    child = gameCards.lastElementChild;
  }

  var rowDiv
  var divCol2Div
  var betweenDiv
  var cardFrontDiv
  var cardBackDiv

  setLevel(level)

  for (var j = 0; j < jMax; j++) {
    rowDiv = document.createElement('div')
    rowDiv.classList.add('row')

    for (var i = 0; i < iMax; i++) {
      divCol2Div = document.createElement('div')
      divCol2Div.classList.add('card', 'get-bigger')

      cardFrontDiv = document.createElement('div')
      cardFrontDiv.classList.add('card-front')

      cardBackDiv = document.createElement('div')
      cardBackDiv.classList.add('card-back')

      divCol2Div.appendChild(cardFrontDiv)
      divCol2Div.appendChild(cardBackDiv)
      rowDiv.appendChild(divCol2Div)
    }
    gameCards.appendChild(rowDiv)
  }

  for (var i = 0; i < card.length; i++) {
    card[i].style.margin = '4rem'
  }
}

// Display stats
function displayStats(displayObj, textStr, color) {
  displayObj.textContent = textStr

  setTimeout(function () {
    displayObj.style.fontWeight = '400'
    displayObj.style.color = 'white'
  }, 1000)
  displayObj.style.fontWeight = changedFontWeight
  displayObj.style.color = color
}

function calculateAccuracy(attempts, matches) {
  if (matches) {
    return Math.floor((Number(matches) / Number(attempts)) * 100)
  } else {
    return 0
  }
}

// Sound
bgMusic = new sound('audio/bg-music.wav', true)
cardMouseOverSound = new sound('audio/mouse-over.wav', false)
successSound = new sound('audio/success.wav', false)
failSound = new sound('audio/fail.wav', false)
cardFlipSound = new sound('audio/card-flip.wav', false)
clickSound = new sound('audio/click.wav', false)

var soundToggle = document.querySelectorAll('.sound-toggle')
var soundControl = document.querySelector('.sound-control')
var soudnToggleTheme = document.querySelector('.sound-toggle-theme')
var soudnToggleLevel = document.querySelector('.sound-toggle-level')
var soudnToggleAgain = document.querySelector('.sound-toggle-again')

for (var i = 0; i < soundToggle.length; i++) {
  soundToggle[i].addEventListener('click', function (e) {
    isSoundOn = !isSoundOn
    if (isSoundOn) {
      soundControl.textContent = 'Sound: ON'
      soundControl.style.color = 'yellowgreen'
      e.target.checked = true
      soudnToggleTheme.checked = true
      soudnToggleLevel.checked = true
      soudnToggleAgain.checked = true
      bgMusic.play()
    } else {
      soundControl.textContent = 'Sound: OFF'
      e.target.checked = false
      soundControl.style.color = 'white'
      soudnToggleTheme.checked = false
      soudnToggleLevel.checked = false
      soudnToggleAgain.checked = false
      bgMusic.stop()
    }
  })
}

soundControl.addEventListener('click', function (e) {
  isSoundOn = !isSoundOn
  if (isSoundOn) {
    soundControl.textContent = 'Sound: ON'
    soundControl.style.color = 'yellowgreen'
    e.target.checked = false
    // soundToggle[i].checked = false
    bgMusic.play()
  } else {
    soundControl.textContent = 'Sound: OFF'
    e.target.checked = true
    // soundToggle[i].checked = true
    soundControl.style.color = 'white'
    bgMusic.stop()
  }
})

function playSound(event) {
  isSoundOn = !isSoundOn
  if (isSoundOn) {
    soundControl.textContent = 'Sound: ON'
    soundControl.style.color = 'yellowgreen'
    event.target.checked = false
    // soundToggle[i].checked = false
    bgMusic.play()
  } else {
    soundControl.textContent = 'Sound: OFF'
    event.target.checked = true
    // soundToggle[i].checked = true
    soundControl.style.color = 'white'
    bgMusic.stop()
  }
}

function sound(src, isLoop) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.loop = isLoop
  this.sound.autoplay = false
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}
