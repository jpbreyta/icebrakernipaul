function clearErrors() {
    for (var loopCounter = 0; loopCounter < document.forms["betForm"].elements.length; loopCounter++) {
        if (document.forms["betForm"].elements[loopCounter]
            .parentElement.className.indexOf("has-") != -1) {

            document.forms["betForm"].elements[loopCounter]
                .parentElement.className = "form-group";
        }
    }
}


function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function play() {

    var bet = document.forms["betForm"]["Bet"].value;

    if (bet == "" || isNaN(bet) || bet <= 0) {
        alert("You must place a Real bet.");
        document.forms["betForm"]["Bet"]
            .parentElement.className = "form-group has-error";
        //document.forms["betForm"]["Bet"].focus();
        return false;
    }


    var currentPot = bet;
    var roll1 = 0;
    var roll2 = 0;
    var rollResult = 0;
    var mostWon = bet;
    var TurnsAtMostWon = 0;

    var totalTurns = 1;

    while (currentPot > 0) {
        roll1 = rollDice();
        roll2 = rollDice();
        rollResult = roll1 + roll2;

        if (rollResult == 7) {
            currentPot += 4;
        } else {
            currentPot -= 1;
        }

        if (mostWon <= currentPot) {
            mostWon = currentPot;
            TurnsAtMostWon = totalTurns;
        }


        // currentPot -= 1;


        console.log(totalTurns);
        totalTurns++
    }

    document.getElementById("results").style.display = "block";
    document.getElementById("start").innerText = bet;
    document.getElementById("totalRolls").innerText = totalTurns;
    document.getElementById("mostWon").innerText = mostWon;
    document.getElementById("totalRollsToBest").innerText = TurnsAtMostWon;



    return false;

}