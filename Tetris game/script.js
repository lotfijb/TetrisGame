// Script is executed after the page / all elements finish loading
window.onload = function () {
  const grid = document.querySelector(".grid");
  const width = 10;
  let nextRandom = 0;
  let timer;
  let score = 0;
  let colors = ["#E3F2FD", "#0C090D", "#EEC170", "#28429F", "#F45B69"];
  // Creating an array of 200 squares
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start_btn");

  // Creating Shapes
  //L Shape
  const L = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  //Z Shape
  const Z = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  // T Shape
  const T = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];
  // O Shape
  const O = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  // I Shape
  const I = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const shapes = [L, Z, T, O, I];
  let currentPosition = 4;
  let rotation = 0;
  //Select a shape randomly
  var random = Math.floor(Math.random() * shapes.length);
  let current = shapes[random][rotation];
  // Coloring the shape
  function color() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("shape");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }
  // Uncoloring the shape
  function uncolor() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("shape");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }
  //Move the shape down every 0.5sec
  //Only start when we press the button
  //timer = setInterval(moveDown, 300);

  //Assign function to keyboard buttons
  function key(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", key);
  //Move down the shape function
  function moveDown() {
    uncolor();
    currentPosition += width;
    color();
    freeze();
  }
  //Freeze the moveDown function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //Start a new shape falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * shapes.length);
      current = shapes[random][0];
      currentPosition = 4;
      color();
      displayNext();
      _score();
      gameOver();
    }
  }
  //Move the shape left if there is no other shape or at the edge
  function moveLeft() {
    uncolor();
    const checkEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!checkEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    color();
  }
  //Move thr shape right if there is no other shape or at the edge
  function moveRight() {
    uncolor();
    const checkEdge = current.some(
      (index) => (currentPosition + index - 9) % width === 0
    );
    if (!checkEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    color();
  }
  //Rotate the shape
  function rotate() {
    uncolor();
    rotation++;
    if (rotation === current.length) {
      rotation = 0;
    }
    current = shapes[random][rotation];
    color();
  }
  //show next shape in mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  //Shapes without rotations
  const nextShapes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  //display the shape in the mini-grid
  function displayNext() {
    //remove the shape from the mini-grid
    displaySquares.forEach((square) => {
      square.classList.remove("shape");
      square.style.backgroundColor = "";
    });
    nextShapes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("shape");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }
  //Getting difficulty value
  let difficulty;
  document.querySelector("form").addEventListener("change", function () {
    var inputs = document.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked === true) break;
    }
    difficulty = inputs[i].value;
    console.log(difficulty);
  });

  //Button functions
  startBtn.addEventListener("click", () => {
    var speed = difficulty * 100;
    if (timer) {
      clearInterval(timer);
      timer = null;
    } else {
      color();
      timer = setInterval(moveDown, speed);
      nextRandom = Math.floor(Math.random() * shapes.length);
      displayNext();
    }
  });
  //Adding the score
  function _score() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("shape");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  //Ending the game
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "Game Over";
      //Refresh the page to start a new game
      let restart = document.getElementById("restart");
      restart.style.display = "inline";
      restart.addEventListener("click", () => {
        window.location.reload();
      });
      console.log(restart);
      clearInterval(timer);
    }
  }
};
