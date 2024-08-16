// Function to sanitize user input
const sanitizeInput = (input) => {
  const validChoices = ["rock", "paper", "scissor"];
  input = input.toLowerCase().trim();
  return validChoices.includes(input) ? input : "invalid";
};

// Function for computer to make a play
const computerPlay = () => {
  const choices = ["Rock", "Paper", "Scissor"];
  const computerPick = Math.floor(Math.random() * choices.length);
  return choices[computerPick];
};

// Function to determine the result of a round
const Round = (computerSelection, playerSelection) => {
  playerSelection = sanitizeInput(playerSelection);
  if (playerSelection === "invalid") return "invalid";

  if (playerSelection === "rock") {
    return computerSelection === "Scissor"
      ? "win"
      : computerSelection === "Paper"
      ? "lose"
      : "draw";
  } else if (playerSelection === "paper") {
    return computerSelection === "Rock"
      ? "win"
      : computerSelection === "Scissor"
      ? "lose"
      : "draw";
  } else if (playerSelection === "scissor") {
    return computerSelection === "Rock"
      ? "lose"
      : computerSelection === "Paper"
      ? "win"
      : "draw";
  }
};

// Function to generate a new secret key
const generateSecretKey = () => {
  const keyPart1 = Math.floor(Math.random() * 1000);
  const keyPart2 = Math.floor(new Date().getTime() % 1000);
  return keyPart1.toString() + keyPart2.toString();
};

// Function to initialize or retrieve the secret key
const initializeSecretKey = () => {
  let secretKey = localStorage.getItem("secret_key");
  if (!secretKey) {
    secretKey = generateSecretKey();
    localStorage.setItem("secret_key", secretKey);
  }
  return secretKey;
};

// Function to encrypt the game state
const encryptGameState = (gameState, key) => {
  const encryptedGameState = {};
  Object.keys(gameState).forEach((k) => {
    if (Array.isArray(gameState[k])) {
      encryptedGameState[k] = JSON.stringify(gameState[k]);
    } else {
      encryptedGameState[k] = gameState[k] ^ parseInt(key, 10);
    }
  });
  return JSON.stringify(encryptedGameState);
};

// Function to decrypt the game state
const decryptGameState = (encryptedGameState, key) => {
  const decryptedGameState = {};
  const parsedState = JSON.parse(encryptedGameState);
  Object.keys(parsedState).forEach((k) => {
    if (Array.isArray(parsedState[k])) {
      decryptedGameState[k] = JSON.parse(parsedState[k]);
    } else {
      decryptedGameState[k] = parsedState[k] ^ parseInt(key, 10);
    }
  });
  return decryptedGameState;
};

// Function to save the game state
const saveGameState = (gameState, secretKey) => {
  const encryptedGameState = encryptGameState(gameState, secretKey);
  localStorage.setItem("game_state", encryptedGameState);
};

// Function to load the game state
const loadGameState = (secretKey) => {
  const encryptedGameState = localStorage.getItem("game_state");
  if (encryptedGameState) {
    try {
      return decryptGameState(encryptedGameState, secretKey);
    } catch (e) {
      console.error("Failed to decrypt game state:", e);
      localStorage.removeItem("game_state");
    }
  }
  return null;
};

// Main game loop function
const gameLoop = () => {
  const secretKey = initializeSecretKey();
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

  // Load game state from localStorage if available
  const savedGameState = loadGameState(secretKey);
  if (savedGameState) {
    game_state = savedGameState;

    const continue_game = confirm(
      `You have a game in progress. Do you want to continue the game?`
    );
    if (!continue_game) {
      localStorage.removeItem("game_state");
      console.log("Game state reset for a new game.");
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
    const ready_to_play = confirm(
      `Welcome to the Rock Paper Scissors Game. Are you ready to play?`
    );
    if (!ready_to_play) {
      console.log("Game canceled by the user.");
      return;
    }
    console.log("Game starting.");
  }

  // Save the initial game state
  saveGameState(game_state, secretKey);

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
        localStorage.removeItem("game_state");
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
    saveGameState(game_state, secretKey);
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

  // Optionally clear localStorage (uncomment if you want to reset it)
  // localStorage.removeItem("game_state");
};

// Start or resume the game
gameLoop();
