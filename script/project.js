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

    // Ask user if they want to continue with the existing game
    const continue_game = confirm(
      `You have a game in progress. Do you want to continue the game?`
    );

    if (!continue_game) {
      // Reset the game state for a new game
      localStorage.removeItem("game_state");
      game_state = {
        playerScore: 0,
        computerScore: 0,
        currentRound: 1,
        maxRounds: 5,
      };
      localStorage.setItem("game_state", JSON.stringify(game_state));
    }
  } else {
    // Only show the welcome prompt if there's no existing game state
    const ready_to_play = confirm(
      `Welcome to the Rock Paper Scissors Game. Are you ready to play?`
    );
    if (!ready_to_play) {
      console.log("Game canceled by the user.");
      return;
    }

    // Save the initial game state
    localStorage.setItem("game_state", JSON.stringify(game_state));
  }

  while (game_state.currentRound <= game_state.maxRounds) {
    console.log(
      `+++++++++++++++++++++++ This is round number ${game_state.currentRound} +++++++++++++++++++++++`
    );

    let playerSelection;
    let result;

    do {
      playerSelection = prompt(
        `Enter your choice for round number ${game_state.currentRound} (Rock, Paper, or Scissor) or press "q" to quit`
      );
      if (playerSelection === null || playerSelection.toLowerCase() === "q") {
        console.log("Game exited by the user.");
        return;
      }
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

  // Final results
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

  // Reset the game state
  localStorage.removeItem("game_state");
};

// Start or resume the game
gameLoop();
