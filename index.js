function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let Players = function createPlayers(){
    let playersArr = [];

    let newPlayer = (name, symbol, turn) => {
        playersArr.push({name, symbol, turn, score: 0});
        // return {name, symbol, turn};
    }

    return {playersArr, newPlayer}
}();

Players.newPlayer("p1", "X", true);
Players.newPlayer("p2", "O", false);

// console.log(Players.playersArr)

let Gameboard = function createGameboard(){
    let gameboardArr = ['', '', '',   '', '', '',   '', '', ''];
    
    let cellsArr = Array.from(document.querySelectorAll(".cell")).map(e => Object.create({element: e, isFull: false}));

    let gameStarted = false;

    return {gameboardArr, cellsArr, gameStarted}
}();

let Controller = function createGameController(){

    let redraw = (i=0) => {
        Gameboard.cellsArr.forEach(e=>{
            if(Gameboard.gameboardArr[i] == "X"){
                e.element.style.color = "red";
            } else {
                e.element.style.color = "blue";
            }
            e.element.textContent = Gameboard.gameboardArr[i];
            i++;
            Controller.drawScores(Players.playersArr);
        })
    }

    let insertPlayerChoice = (cellIndex) => {
        Players.playersArr.forEach(e=>{
            if(e.turn){
                Gameboard.gameboardArr[cellIndex-1] = e.symbol;
                Gameboard.cellsArr[cellIndex-1].isFull = true;
            }
        })
        Players.playersArr.forEach(e=>{
            e.turn = !e.turn;
        })

        redraw();
    }

    let checkForWinners = () => {
        console.log(Gameboard.gameboardArr);
        let lineIndeces = [[1,2,3], [4,5,6], [7,8,9], [1,5,9], [3,5,7], [1,4,7], [2,5,8], [3,6,9]];
        lineIndeces.forEach(async line=>{

            if(Gameboard.gameboardArr[line[0]-1] == Gameboard.gameboardArr[line[1]-1] && Gameboard.gameboardArr[line[1]-1] == Gameboard.gameboardArr[line[2]-1] && Gameboard.gameboardArr[line[2]-1] != ""){
                
                Players.playersArr.forEach(async e=>{
                    if(e.symbol == Gameboard.gameboardArr[line[0]-1]){
                        e.score++;
                        e.turn = true;
                        Gameboard.cellsArr.forEach(c=> c.isFull = true);
                        Gameboard.cellsArr[line[0]-1].element.style.backgroundColor = "black"
                        Gameboard.cellsArr[line[1]-1].element.style.backgroundColor = "black"
                        Gameboard.cellsArr[line[2]-1].element.style.backgroundColor = "black"
                        await sleep(1000)
                        Gameboard.gameboardArr = ['', '', '',   '', '', '',   '', '', ''];
                        Gameboard.cellsArr.forEach(c=> c.isFull = false);
                        Controller.redraw();
                        Gameboard.cellsArr[line[0]-1].element.style.backgroundColor = "white"
                        Gameboard.cellsArr[line[1]-1].element.style.backgroundColor = "white"
                        Gameboard.cellsArr[line[2]-1].element.style.backgroundColor = "white"
                    } else {
                        e.turn = false;
                    }
                })
                Controller.redraw();
            } else {
                if(!Gameboard.gameboardArr.includes("")){
                    Gameboard.cellsArr.forEach(async c=>{
                        c.element.style.backgroundColor = "green";
                    })
                    Gameboard.gameboardArr = ['', '', '',   '', '', '',   '', '', ''];
                    Gameboard.cellsArr.forEach(c=> c.isFull = false);
                    await sleep(1000);
                    Gameboard.cellsArr.forEach(async c=>{
                        c.element.style.backgroundColor = "white";
                    })
                    redraw();
                }
            }
        })

    }

    let drawScores = () => {
        document.querySelector("#p1-score").textContent = Players.playersArr[0].score;
        document.querySelector("#p2-score").textContent = Players.playersArr[1].score;

        if(Players.playersArr[0].turn){
            document.querySelector("#p1-label").style.backgroundColor = "red"
            document.querySelector("#p2-label").style.backgroundColor = "white"
        } else {
            document.querySelector("#p2-label").style.backgroundColor = "blue"
            document.querySelector("#p1-label").style.backgroundColor = "white"
        }
        
    }

    return {redraw, insertPlayerChoice, checkForWinners, drawScores};

}(Gameboard, Players);

Gameboard.cellsArr.forEach(e=>{
    e.element.addEventListener("click", (x)=>{
        if(e.isFull){
            return;
        }
        Controller.insertPlayerChoice(x.target.id)
        e.isFull = true;
        Controller.checkForWinners();
    })
})

Controller.redraw()
