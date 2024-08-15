//validation for input
const sanitizeInput = (input) => {
  const validChoices = ["rock", "paper", "scissor"];
  input = input.toLowerCase().trim();
  return validChoices.includes(input) ? input : "invalid";
};

const computerPlay = function () {
  const rock_paper_scissors = ["Rock", "Paper", "Scissor"];
  const computer_pick = Math.floor(Math.random() * rock_paper_scissors.length);
  return rock_paper_scissors[computer_pick];
};

const Round = function (computerSelection, playerSelection) {
  playerSelection = sanitizeInput(playerSelection);
  if (playerSelection === "invalid") return "invalid";

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
//Avoid storing sensitive or critical data.
//Validate and sanitize the retrieved data before using it.
const getSavedGameState = () => {
  try {
    const savedState = JSON.parse(localStorage.getItem("game_state"));
    if (
      savedState &&
      typeof savedState.playerScore === "number" &&
      typeof savedState.computerScore === "number" &&
      typeof savedState.currentRound === "number" &&
      typeof savedState.maxRounds === "number"
    ) {
      return savedState;
    }
  } catch (error) {
    console.error("Invalid game state data:", error);
  }
  return null;
};

const encryptGameState = (gameState, key) => {
  const encryptedGameState = {};
  Object.keys(gameState).forEach((key) => {
    encryptedGameState[key] = gameState[key] ^ key.charCodeAt(0);
  });
  return encryptedGameState;
};

const decryptGameState = (encryptedGameState, key) => {
  const decryptedGameState = {};
  Object.keys(encryptedGameState).forEach((key) => {
    decryptedGameState[key] = encryptedGameState[key] ^ key.charCodeAt(0);
  });
  return decryptedGameState;
};

const generateSecretKey = () => {
  const keyPart1 = "mySecretKey".charCodeAt(0) + Math.random() * 100;
  const keyPart2 = (new Date().getTime() % 1000) + 123;
  return String.fromCharCode(keyPart1) + String.fromCharCode(keyPart2);
};

const gameLoop = () => {
  let game_state = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
  };

  const secretKey = generateSecretKey();

  // Load game state from localStorage if available
  if (localStorage.getItem("game_state")) {
    const encryptedGameState = JSON.parse(localStorage.getItem("game_state"));
    game_state = decryptGameState(encryptedGameState, secretKey);

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
      const encryptedGameState = encryptGameState(game_state, secretKey);
      localStorage.setItem("game_state", JSON.stringify(encryptedGameState));
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
    const encryptedGameState = encryptGameState(game_state, secretKey);
    localStorage.setItem("game_state", JSON.stringify(encryptedGameState));
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
    const encryptedGameState = encryptGameState(game_state, secretKey);
    localStorage.setItem("game_state", JSON.stringify(encryptedGameState));
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