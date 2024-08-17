// Validation for input
const sanitizeInput = (input) => {
  const validChoices = ["rock", "paper", "scissor"];
  input = input.toLowerCase().trim();
  return validChoices.includes(input) ? input : "invalid";
};

// Input validation for rounds
const validateUserInput = (playerSelection) => {
  playerSelection = sanitizeInput(playerSelection);
  if (playerSelection === "invalid") {
    console.log("Invalid input. Please enter Rock, Paper, or Scissor.");
  }
  return playerSelection;
};

const computerPlay = () => {
  const rock_paper_scissors = ["Rock", "Paper", "Scissor"];
  const computer_pick = Math.floor(Math.random() * rock_paper_scissors.length);
  return rock_paper_scissors[computer_pick];
};

const round = (computerSelection, playerSelection) => {
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

const gameLoop = () => {
  let playerScore = 0;
  let computerScore = 0;
  const maxRounds = 5;
  let currentRound = 1;
  let gameState = [];

  const ready_to_play = confirm(
    `Welcome to the Rock Paper Scissors Game. Are you ready to play?
 perss (ctrl + shift + i) to open the console 
    `
  );
  if (!ready_to_play) {
    console.log("Game canceled by the user.");
    return;
  }

  while (currentRound <= maxRounds) {
    console.log(
      `+++++++++++++++++++++++ This is round number ${currentRound} +++++++++++++++++++++++`
    );

    let playerSelection;
    let result;
    let computerSelection;

    do {
      playerSelection = prompt(
        `Enter your choice for round number ${currentRound} (Rock, Paper, or Scissor) or press "q" to quit`
      );
      if (playerSelection === null || playerSelection.toLowerCase() === "q") {
        console.log("Game exited by the user.");
        return;
      }

      playerSelection = validateUserInput(playerSelection);
    } while (playerSelection === "invalid");

    computerSelection = computerPlay();
    result = round(computerSelection, playerSelection);

    if (result === "win") {
      playerScore++;
    } else if (result === "lose") {
      computerScore++;
    }

    // Store round details in the game state
    gameState.push({
      round: currentRound,
      playerSelection: playerSelection,
      computerSelection: computerSelection,
      result: result,
    });

    // Log round details
    console.log(`Round ${currentRound} summary:`);
    console.log(`You chose: ${playerSelection}`);
    console.log(`Computer chose: ${computerSelection}`);
    console.log(`Result: You ${result} this round`);
    console.log(
      `Current score: \nPlayer: ${playerScore}\nComputer: ${computerScore}`
    );

    currentRound++;
  }

  // Game summary
  console.log(`\n+++++++++++++++++++++++ Game Summary +++++++++++++++++++++++`);
  gameState.forEach((round) => {
    console.log(
      `Round ${round.round}: You chose ${round.playerSelection}, Computer chose ${round.computerSelection}. Result: You ${round.result}.`
    );
  });

  console.log(
    `Final score - Player: ${playerScore}, Computer: ${computerScore}`
  );
  if (playerScore > computerScore) {
    console.log("Congratulations! You are the overall winner!");
  } else if (playerScore < computerScore) {
    console.log("Sorry! The computer is the overall winner.");
  } else {
    console.log("It's a tie!");
  }

  // Ask user if they want to play again
  const playAgain = confirm("Do you want to play a new game?");
  if (playAgain) {
    gameLoop(); // Start a new game
  } else {
    console.log("Thanks for playing, press ctrl + F5 to play a new game");
  }
};

// Start the game
gameLoop();
