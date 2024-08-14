//computer play function
const computerPlay = function () {
  //array for selection
  const rock_paper_scissors = ["Rock", "Paper", "Scissor"];
  // array random index for selection
  const computer_pick = Math.floor(Math.random() * rock_paper_scissors.length);
  //select the random string by the random index
  const computer_selection = rock_paper_scissors[computer_pick];
  return computer_selection;
};

// rounds of the game
const Round = function (computerSelection, playerSelection) {
  playerSelection = playerSelection.toLowerCase(); // Normalize player input to lowercase
  let result;

  if (playerSelection === "rock") {
    if (computerSelection === "Scissor") {
      result = "win";
    } else if (computerSelection === "Paper") {
      result = "lose";
    } else {
      result = "draw";
    }
  } else if (playerSelection === "paper") {
    if (computerSelection === "Rock") {
      result = "win";
    } else if (computerSelection === "Scissor") {
      result = "lose";
    } else {
      result = "draw";
    }
  } else if (playerSelection === "scissor") {
    if (computerSelection === "Rock") {
      result = "lose";
    } else if (computerSelection === "Paper") {
      result = "win";
    } else {
      result = "draw";
    }
  } else {
    result = "invalid";
  }

  return result;
};

// process structure :

// 1) I must create a function called gameLoop
// 2) I must make a loop inside the function that itterats 5 times (to play 5 rounds of game)
// 3) prompt the user input and the computer selection
// 4)I must call the playRound function inside this loop
// 5) display the info of each round using console.log and the winner

const gameLoop = () => {
  let player_score = 0;
  let computer_score = 0;
  
  const ready_to_play = confirm(`welcome to Rock Paper & Scissors Game are you ready to play ?`);
  if (!ready_to_play) {
    console.log("Game canceled by the user.");
    return;
  }
  //start of the game loop
  for (let i = 1; i <= 5; i++) {
    console.log(
      `+++++++++++++++++++++++This is round number ${i}+++++++++++++++++++++++`
    );
    let playerSelection;
    let result;

    do {
      playerSelection = prompt(
        `Enter your choice for round number ${i} (Rock, Paper, or Scissor) or q to exit`
      );
      if (playerSelection === null || playerSelection.toLowerCase() === 'q') {
        console.log("Game exited by the user.");
        return;
      }
      result = Round(computerPlay(), playerSelection);

      if (result === "invalid") {
        console.log("Invalid input. Please enter Rock, Paper, or Scissor.");
      }
    } while (result === "invalid");

    if (result === "win") {
      player_score++;
    } else if (result === "lose") {
      computer_score++;
    }
    console.log(`You ${result} in round number ${i}`);
    console.log( `Current score: \nPlayer: ${player_score}\nComputer: ${computer_score}` );
  }//end of the loop

  //final results
  console.log(`Final score - Player: ${player_score}, Computer: ${computer_score}`);
  //determine the winner and the loser
  if (player_score > computer_score) {
    console.log("Congratulations! You are the overall winner!");
  } else if (player_score < computer_score) {
    console.log("Sorry! The computer is the overall winner.");
  } else {
    console.log("It's a tie!");
  }
};

gameLoop();
