//computer play function
const computerPlay = function () {
    //array for selection
    const rock_paper_scissors = ["Rock", "Paper", "Scissor"];
    // array random index for selection
    const computer_pick = Math.floor(Math.random() * rock_paper_scissors.length);
    //select the random string by the random index
    const computer_selection = rock_paper_scissors[computer_pick];
    console.log(computer_selection); // This will log the computer's selection
    return computer_selection;
};

// Example usage:
computerPlay()
