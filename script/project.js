const sanitizeInput = (input) => {
  const validChoices = ["rock", "paper", "scissor"];
  input = input.toLowerCase().trim();
  return validChoices.includes(input) ? input : "invalid";
};

const computerPlay = () => {
  const rock_paper_scissors = ["Rock", "Paper", "Scissor"];
  const computer_pick = Math.floor(Math.random() * rock_paper_scissors.length);
  return rock_paper_scissors[computer_pick];
};

const Round = (computerSelection, playerSelection) => {
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
  }

  return result;
};

const generateSecretKey = () => {
  const keyPart1 = Math.floor(Math.random() * 1000);
  const keyPart2 = Math.floor(new Date().getTime() % 1000);
  return keyPart1.toString() + keyPart2.toString();
};

const encryptGameState = (gameState, key) => {
  const encryptedGameState = {};
  Object.keys(gameState).forEach((k) => {
    if (Array.isArray(gameState[k])) {
      encryptedGameState[k] = JSON.stringify(gameState[k]);
    } else {
      encryptedGameState[k] = gameState[k] ^ parseInt(key, 10);
    }
  });
  return encryptedGameState;
};

const decryptGameState = (encryptedGameState, key) => {
  const decryptedGameState = {};
  Object.keys(encryptedGameState).forEach((k) => {
    if (Array.isArray(encryptedGameState[k])) {
      decryptedGameState[k] = JSON.parse(encryptedGameState[k]);
    } else {
      decryptedGameState[k] = encryptedGameState[k] ^ parseInt(key, 10);
    }
  });
  return decryptedGameState;
};

const gameLoop = () => {
  let game_state = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
    playerChoices: [],
    computerChoices: [],
    roundResults: [],
    gamesWon: 0,
    isRoundInProgress: false,
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
        playerChoices: [],
        computerChoices: [],
        roundResults: [],
        gamesWon: 0,
        isRoundInProgress: false,
      };
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
  }

  // Save the initial game state
  const encryptedGameState = encryptGameState(game_state, secretKey);
  localStorage.setItem("game_state", JSON.stringify(encryptedGameState));

  while (game_state.currentRound <= game_state.maxRounds) {
    console.log(
      `+++++++++++++++++++++++ This is round number ${game_state.currentRound} +++++++++++++++++++++++`
    );

    let playerSelection;
    let result;

    game_state.isRoundInProgress = true;

    do {
      playerSelection = prompt(
        `Enter your choice for round number ${game_state.currentRound} (Rock, Paper, or Scissor) or press "q" to quit`
      );
      if (playerSelection === null || playerSelection.toLowerCase() === "q") {
        console.log("Game exited by the user.");
        // localStorage.removeItem
        return;
      }
      result = Round(computerPlay(), playerSelection);

      if (result === "invalid") {
        console.log("Invalid input. Please enter Rock, Paper, or Scissor.");
      }
    } while (result === "invalid");

    game_state.playerChoices.push(playerSelection);
    game_state.computerChoices.push(computerPlay());
    game_state.roundResults.push(result);

    if (result === "win") {
      game_state.playerScore++;
    } else if (result === "lose") {
      game_state.computerScore++;
    }

    console.log(`You ${result} in round number ${game_state.currentRound}`);
    console.log(
      `Current score: \nPlayer: ${game_state.playerScore}\nComputer: ${game_state.computerScore}`
    );

    game_state.isRoundInProgress = false;

    game_state.currentRound++;
    const encryptedGameState = encryptGameState(game_state, secretKey);
    localStorage.setItem("game_state", JSON.stringify(encryptedGameState));
  }

  // Check if the player won the game
  if (game_state.playerScore > game_state.computerScore) {
    game_state.gamesWon++;
    console.log("Congratulations! You won the game!");
  } else if (game_state.playerScore < game_state.computerScore) {
    console.log("Sorry! The computer won the game.");
  } else {
    console.log("It's a tie!");
  }

  // Display game summary
  console.log("Game summary:");
  for (let i = 0; i < game_state.roundResults.length; i++) {
    console.log(
      `Round ${i + 1}: You chose ${
        game_state.playerChoices[i]
      }, Computer chose ${game_state.computerChoices[i]}, Result: ${
        game_state.roundResults[i]
      }`
    );
  }

  // Reset the game state
  localStorage.removeItem("game_state");
};

// Start or resume the game
gameLoop();
