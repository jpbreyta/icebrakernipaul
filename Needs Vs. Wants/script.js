// Lists of needs and wants
const needsList = [
    "Laptop",
    "Wallet",
    "Shoes",
    "Notebook",
    "Charger",
    "Backpack",
    "Watch",
    "Bottle",
    "Pen",
    "Umbrella",
    "Clothes",
    "Toothbrush",
    "Toothpaste",
    "Soap",
    "Blanket",
    "Bed",
    "Food",
    "Water",
    "Medicine",
    "Toilet paper",
  ]
  
  const wantsList = [
    "Guitar",
    "Headphones",
    "Sunglasses",
    "Camera",
    "Pillow",
    "Flashlight",
    "Belt",
    "Ring",
    "Jacket",
    "Phone",
    "Skateboard",
    "Smartwatch",
    "Laptop stand",
    "Artwork",
    "Drone",
    "Video game",
    "Perfume",
    "Speaker",
    "Bag",
    "TV",
  ]
  
  // Game variables
  let gameStarted = false
  let bombIndexesGroup1 = []
  let bombIndexesGroup2 = []
  let livesGroup1 = 5
  let livesGroup2 = 5
  let currentItem = ""
  let currentItemType = ""
  let timer = null
  let timeLeft = 20
  let activeBox = null
  let activeGroup = null
  
  function getRandomBombs() {
    const bombs = new Set()
    while (bombs.size < 5) {
      bombs.add(Math.floor(Math.random() * 20) + 1)
    }
    return Array.from(bombs)
  }
  
  function getRandomItem() {
    // Randomly decide if it's a need or want
    const isNeed = Math.random() > 0.5
  
    if (isNeed) {
      const randomIndex = Math.floor(Math.random() * needsList.length)
      return { item: needsList[randomIndex], type: "need" }
    } else {
      const randomIndex = Math.floor(Math.random() * wantsList.length)
      return { item: wantsList[randomIndex], type: "want" }
    }
  }
  
  function updateLivesDisplay() {
    // Update Group 1 lives display
    const livesGroup1Display = document.getElementById("lives-group1")
    const livesGroup1Icons = livesGroup1Display.querySelectorAll(".life-icon")
  
    for (let i = 0; i < livesGroup1Icons.length; i++) {
      if (i < livesGroup1) {
        livesGroup1Icons[i].classList.remove("life-lost")
      } else {
        livesGroup1Icons[i].classList.add("life-lost")
      }
    }
  
    // Update Group 2 lives display
    const livesGroup2Display = document.getElementById("lives-group2")
    const livesGroup2Icons = livesGroup2Display.querySelectorAll(".life-icon")
  
    for (let i = 0; i < livesGroup2Icons.length; i++) {
      if (i < livesGroup2) {
        livesGroup2Icons[i].classList.remove("life-lost")
      } else {
        livesGroup2Icons[i].classList.add("life-lost")
      }
    }
  }
  
  function createBoxes(groupId) {
    const container = document.getElementById(groupId)
    container.innerHTML = ""
    let bombIndexes = groupId === "group1" ? bombIndexesGroup1 : bombIndexesGroup2
  
    if (groupId === "group1") {
      bombIndexesGroup1 = getRandomBombs()
      bombIndexes = bombIndexesGroup1
    } else {
      bombIndexesGroup2 = getRandomBombs()
      bombIndexes = bombIndexesGroup2
    }
  
    for (let i = 1; i <= 20; i++) {
      const box = document.createElement("div")
      box.classList.add("random-box")
      box.textContent = i
  
      // Generate a random item for this box
      const { item, type } = getRandomItem()
      box.dataset.item = item
      box.dataset.type = type
  
      box.onclick = () => {
        if (gameStarted) {
          if (bombIndexes.includes(i)) {
            box.classList.add("bomb")
            if (groupId === "group1") {
              livesGroup1--
              updateLivesDisplay()
              if (livesGroup1 > 0) {
                Swal.fire({
                  title: `Group 1 hit a bomb! Lives left: ${livesGroup1}`,
                  icon: "error",
                  confirmButtonText: "OK",
                })
              } else {
                Swal.fire({
                  title: "Group 1 Game Over! You ran out of lives.",
                  icon: "error",
                  confirmButtonText: "Restart",
                }).then(() => restartGame())
              }
            } else {
              livesGroup2--
              updateLivesDisplay()
              if (livesGroup2 > 0) {
                Swal.fire({
                  title: `Group 2 hit a bomb! Lives left: ${livesGroup2}`,
                  icon: "error",
                  confirmButtonText: "OK",
                })
              } else {
                Swal.fire({
                  title: "Group 2 Game Over! You ran out of lives.",
                  icon: "error",
                  confirmButtonText: "Restart",
                }).then(() => restartGame())
              }
            }
          } else {
            // Show the item and ask if it's a need or a want using SweetAlert
            box.classList.add("selected")
            activeBox = box
            activeGroup = groupId
            showItemQuestion(box.dataset.item, box.dataset.type)
          }
          box.onclick = null
        }
      }
      container.appendChild(box)
    }
  }
  
  function showItemQuestion(item, type) {
    currentItem = item
    currentItemType = type
  
    Swal.fire({
      title: "Is this item a Need or a Want?",
      html: `<div class="current-item">${item}</div>`,
      showDenyButton: true,
      confirmButtonText: "Need",
      denyButtonText: "Want",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        startTimer()
      },
    }).then((result) => {
      clearInterval(timer)
  
      let answer
      if (result.isConfirmed) {
        answer = "need"
      } else if (result.isDenied) {
        answer = "want"
      }
  
      checkAnswer(answer)
    })
  }
  
  function checkAnswer(answer) {
    let isCorrect = false
    let message = ""
  
    // Check if the answer is correct
    if (currentItemType === "need" && answer === "need") {
      isCorrect = true
      message = `Correct! ${currentItem} is a need.`
    } else if (currentItemType === "want" && answer === "want") {
      isCorrect = true
      message = `Correct! ${currentItem} is a want.`
    } else {
      isCorrect = false
      message = `Incorrect. ${currentItem} is a ${currentItemType}.`
  
      // Deduct a life for incorrect answer
      if (activeGroup === "group1") {
        livesGroup1--
        if (livesGroup1 <= 0) {
          updateLivesDisplay()
          Swal.fire({
            title: "Group 1 Game Over! You ran out of lives.",
            icon: "error",
            confirmButtonText: "Restart",
          }).then(() => restartGame())
          return
        }
      } else {
        livesGroup2--
        if (livesGroup2 <= 0) {
          updateLivesDisplay()
          Swal.fire({
            title: "Group 2 Game Over! You ran out of lives.",
            icon: "error",
            confirmButtonText: "Restart",
          }).then(() => restartGame())
          return
        }
      }
      updateLivesDisplay()
    }
  
    // Display the result
    Swal.fire({
      title: isCorrect ? "Correct!" : "Incorrect!",
      text: message,
      icon: isCorrect ? "success" : "error",
      confirmButtonText: "Continue",
    })
  
    // Reset timer
    resetTimer()
  }
  
  function startTimer() {
    // Reset timer
    timeLeft = 20
    updateTimerDisplay()
  
    // Clear any existing timer
    if (timer) clearInterval(timer)
  
    // Start new timer
    timer = setInterval(() => {
      timeLeft--
      updateTimerDisplay()
  
      if (timeLeft <= 0) {
        clearInterval(timer)
        Swal.close()
        timeOut()
      }
    }, 1000)
  }
  
  function updateTimerDisplay() {
    const timerText = document.getElementById("timer-text")
    const timerBar = document.getElementById("timer-bar")
  
    timerText.textContent = `Time: ${timeLeft}s`
    timerBar.style.width = `${(timeLeft / 20) * 100}%`
  
    // Change color based on time left
    if (timeLeft <= 5) {
      timerBar.className = "progress-bar bg-danger"
    } else if (timeLeft <= 10) {
      timerBar.className = "progress-bar bg-warning"
    } else {
      timerBar.className = "progress-bar bg-info"
    }
  }
  
  function resetTimer() {
    timeLeft = 20
    updateTimerDisplay()
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
  
  function timeOut() {
    // Penalize the player for timeout
    if (activeGroup === "group1") {
      livesGroup1--
      updateLivesDisplay()
      if (livesGroup1 <= 0) {
        Swal.fire({
          title: "Group 1 Game Over! You ran out of lives.",
          icon: "error",
          confirmButtonText: "Restart",
        }).then(() => restartGame())
        return
      }
    } else {
      livesGroup2--
      updateLivesDisplay()
      if (livesGroup2 <= 0) {
        Swal.fire({
          title: "Group 2 Game Over! You ran out of lives.",
          icon: "error",
          confirmButtonText: "Restart",
        }).then(() => restartGame())
        return
      }
    }
  
    Swal.fire({
      title: "Time's up!",
      text: `${currentItem} is a ${currentItemType}.`,
      icon: "warning",
      confirmButtonText: "Continue",
    })
  }
  
  function showInstructions() {
    Swal.fire({
      title: 'How to Play "Needs vs Wants Game"',
      html: `
        <div class="instructions-list">
          <h5>Game Objective:</h5>
          <p>Learn to distinguish between "needs" (essential items) and "wants" (desirable but not essential items) while avoiding bombs.</p>
          
          <h5>Game Rules:</h5>
          <ol>
            <li><strong>Starting the Game:</strong> Click the "Play" button to begin. Each group has 5 lives (shown as hearts).</li>
            
            <li><strong>Taking Turns:</strong> Players from Group 1 and Group 2 take turns selecting boxes.</li>
            
            <li><strong>Box Selection:</strong> Click on any numbered box to reveal what's inside.</li>
            
            <li><strong>Bombs:</strong> Some boxes contain bombs. If you hit a bomb, your group loses one life.</li>
            
            <li><strong>Items Classification:</strong> If a box doesn't contain a bomb, it will reveal an item. You'll have 20 seconds to classify it as:
              <ul>
                <li><strong>Need:</strong> Essential items for survival (food, water, shelter, etc.)</li>
                <li><strong>Want:</strong> Non-essential items that are desirable but not required</li>
              </ul>
            </li>
            
            <li><strong>Timer:</strong> A 20-second timer starts when an item is revealed. You must answer before time runs out.</li>
            
            <li><strong>Scoring:</strong>
              <ul>
                <li>Correct classification: No penalty</li>
                <li>Incorrect classification: Lose one life</li>
                <li>Time runs out: Lose one life</li>
              </ul>
            </li>
            
            <li><strong>Game Over:</strong> The game ends when a group loses all 5 lives.</li>
            
            <li><strong>Restart:</strong> Click the "Restart" button at any time to start a new game.</li>
          </ol>
          
          <h5>Educational Value:</h5>
          <p>This game helps players understand the difference between needs (essential for survival) and wants (desirable but not necessary), an important financial literacy concept.</p>
        </div>
      `,
      width: "800px",
      confirmButtonText: "Got it!",
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
    })
  }
  
  function startGame() {
    gameStarted = true
    livesGroup1 = 5
    livesGroup2 = 5
    updateLivesDisplay()
  
    document.querySelectorAll(".random-box").forEach((box) => {
      box.style.pointerEvents = "auto"
    })
  
    Swal.fire({
      title: "Game Started!",
      text: "Avoid the bombs and classify items correctly!",
      icon: "info",
      confirmButtonText: "OK",
    })
  }
  
  function restartGame() {
    gameStarted = false
    livesGroup1 = 5
    livesGroup2 = 5
    bombIndexesGroup1 = []
    bombIndexesGroup2 = []
  
    // Reset timer
    resetTimer()
    updateLivesDisplay()
  
    createBoxes("group1")
    createBoxes("group2")
  
    Swal.fire({
      title: "Game Restarted!",
      icon: "warning",
      confirmButtonText: "OK",
    })
  }
  
  window.onload = () => {
    if (typeof Swal === "undefined") {
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11"
      script.onload = () => {
        initializeGame()
      }
      document.head.appendChild(script)
    } else {
      initializeGame()
    }
  
    function initializeGame() {
      createBoxes("group1")
      createBoxes("group2")
      updateLivesDisplay()
  
      document.getElementById("play-button").addEventListener("click", startGame)
      document.getElementById("restart-button").addEventListener("click", restartGame)
      document.getElementById("info-button").addEventListener("click", showInstructions)

    }
  }
  
  