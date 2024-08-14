const computerPlay = function () {
  const rock_paper_scissors = ["Rock", "Paper", "Scissor"];
  const computer_pick = Math.floor(Math.random() * rock_paper_scissors.length);
  return rock_paper_scissors[computer_pick];
};

const Round = function (computerSelection, playerSelection) {
  playerSelection = playerSelection.toLowerCase();
  let result;

  if (playerSelection === "rock") {
    result =
      computerSelection === "Scissor"
        ? "win"
        : computerSelection === "Paper"
        ? "lose"
        : "draw";
  } else if (playerSelection === "paper") {
    result =
      computerSelection === "Rock"
        ? "win"
        : computerSelection === "Scissor"
        ? "lose"
        : "draw";
  } else if (playerSelection === "scissor") {
    result =
      computerSelection === "Rock"
        ? "lose"
        : computerSelection === "Paper"
        ? "win"
        : "draw";
  } else {
    result = "invalid";
  }

  return result;
};

const gameLoop = () => {
  let game_state = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
  };

  // Load game state from localStorage if available
  if (localStorage.getItem("game_state")) {
    game_state = JSON.parse(localStorage.getItem("game_state"));
  } else {
    // Set initial state if not available
    localStorage.setItem("game_state", JSON.stringify(game_state));
  }

  while (game_state.currentRound <= game_state.maxRounds) {
    console.log(
      `+++++++++++++++++++++++This is round number ${game_state.currentRound}+++++++++++++++++++++++`
    );

    let playerSelection;
    let result;

    do {
      playerSelection = prompt(
        `Enter your choice for round number ${game_state.currentRound} (Rock, Paper, or Scissor)`
      );
      result = Round(computerPlay(), playerSelection);

      if (result === "invalid") {
        console.log("Invalid input. Please enter Rock, Paper, or Scissor.");
      }
    } while (result === "invalid");

    if (result === "win") {
      game_state.playerScore++;
    } else if (result === "lose") {
      game_state.computerScore++;
    }

    console.log(`You ${result} in round number ${game_state.currentRound}`);
    console.log(
      `Current score: \nPlayer: ${game_state.playerScore}\nComputer: ${game_state.computerScore}`
    );

    game_state.currentRound++;
    localStorage.setItem("game_state", JSON.stringify(game_state));
  }

  console.log(
    `Final score - Player: ${game_state.playerScore}, Computer: ${game_state.computerScore}`
  );

  if (game_state.playerScore > game_state.computerScore) {
    console.log("Congratulations! You are the overall winner!");
  } else if (game_state.playerScore < game_state.computerScore) {
    console.log("Sorry! The computer is the overall winner.");
  } else {
    console.log("It's a tie!");
  }

  localStorage.removeItem("game_state");
};

// Start or resume the game
gameLoop();
