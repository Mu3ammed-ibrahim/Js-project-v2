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
const Round = function(computerSelection, playerSelection) {
    computerSelection = computerPlay(); // Generate the computer's choice
    
    const player_input = function(input) {
        input = input.toLowerCase(); // Normalize player input to lowercase
        if (input === "rock") {
            if (computerSelection === "Scissor") {
                console.log("You Win! Rock beats Scissor");
            } else if (computerSelection === "Paper") {
                console.log("You Lose! Paper beats Rock");
            } else {
                console.log("It's a Draw");
            }
        } else if (input === "paper") {
            if (computerSelection === "Rock") {
                console.log("You Win! Paper beats Rock");
            } else if (computerSelection === "Scissor") {
                console.log("You Lose! Scissor beats Paper");
            } else {
                console.log("It's a Draw");
            }
        } else if (input === "scissor") {
            if (computerSelection === "Rock") {
                console.log("You Lose! Rock beats Scissor");
            } else if (computerSelection === "Paper") {
                console.log("You Win! Scissor beats Paper");
            } else {
                console.log("It's a Draw");
            }
        } else if (input === "" || input.trim() === "") {
            console.log("Please choose Rock, Paper, or Scissor");
        } else {
            console.log("Invalid input. Please choose Rock, Paper, or Scissor.");
        }
    }

    return player_input(playerSelection); // Execute the player's input function
}
// Example of playing a round in the console
const playerSelection = prompt("Enter your choice (Rock, Paper, or Scissor):");
Round(computerPlay(), playerSelection);

