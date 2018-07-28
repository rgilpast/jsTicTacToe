class Board {
    
    constructor() {
        this.reset();
    }
    reset() {
        this.cells = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }
    draw() {

        let htmlCells = document.getElementsByClassName("cell");
        let elements  = Array.from(htmlCells);
        elements.map((tag, index) => {
            let value = this.cells[Math.floor(index/3)][index%3];
            tag.innerHTML = '';
            if (value != null) {
                let symbol = value == true ? 'X' : 'O';
                let color = value == true ? '#FFA000' : '#607D8B';
                tag.innerHTML = `<span style="color: ${color}">${symbol}</span>`;
            }
        })
    }
}

class Game {

    constructor() {

        this.setupListeners();
        this.board = new Board();
        this.cpuMove = false;
        this.numNodes = 0;
        this.shouldRestart = false;
    }

    setupListeners() {

        let htmlCells = document.getElementsByClassName("cell");
        for (let i = 0; i < htmlCells.length; i++) {
            htmlCells[i].onclick = (e) => this.clickOnCell(i);
        }    
    }

    clickOnCell(cellIndex) {

        if (!this.shouldRestart) {
            let row = Math.floor(cellIndex/3);
            let col = cellIndex%3;
            if (!this.cpuMove && (this.board.cells[row][col] == null)) {
                this.board.cells[row][col] = false;
                this.cpuMove = true;
                this.updateMove();
                this.makeCPUMove();
            }    
        }
    }
    
    restart() {
    
        this.board.reset();
        this.cpuMove = false;
        this.shouldRestart = false;
        this.updateMove();
        this.hideRestart();
    }
    
    updateMove() {

        this.board.draw();
        
        let winner = this.getWinner(this.board.cells);
        
        let winnerHTML = document.getElementById("winner");
        winnerHTML.innerHTML = winner == 1 ? "CPU Win!" : winner == 0 ? "You Win!" : winner == -1 ? "Tie!" : "";
        
        if (winner != null) {
            this.shouldRestart = true;
            this.showRestart();
        }
    }
    
    showRestart() {
        let restartHTML = document.getElementById("restart");
        restartHTML.className = "restart-show";
        restartHTML.onclick = (e) => this.restart();
    }

    hideRestart() {
        let restartHTML = document.getElementById("restart");
        restartHTML.className = "restart-hide";
        restartHTML.onclick = null;
    }
        
    getWinner(cells) {
    
        // Check if someone won
        let vals = [true, false];
        let allNotNull = true;
        for (let k = 0; k < vals.length; k++) {
            let value = vals[k];
            
            // Check rows, columns, and diagonals
            let diagonalComplete1 = true;
            let diagonalComplete2 = true;
            for (let i = 0; i < 3; i++) {
                if (cells[i][i] != value) {
                    diagonalComplete1 = false;
                }
                if (cells[2 - i][i] != value) {
                    diagonalComplete2 = false;
                }
                let rowComplete = true;
                let colComplete = true;
                for (let j = 0; j < 3; j++) {
                    if (cells[i][j] != value) {
                        rowComplete = false;
                    }
                    if (cells[j][i] != value) {
                        colComplete = false;
                    }
                    if (cells[i][j] == null) {
                        allNotNull = false;
                    }
                }
                if (rowComplete || colComplete) {
                    return value ? 1 : 0;
                }
            }
            if (diagonalComplete1 || diagonalComplete2) {
                return value ? 1 : 0;
            }
        }
        if (allNotNull) {
            return -1;
        }
        return null;
    }

    makeCPUMove() {

        this.board.cells = this.minimaxMove(this.board.cells);
        console.log(this.numNodes);
        this.cpuMove = false;
        this.updateMove();
    }
    
    minimaxMove(cells) {

        this.numNodes = 0;
        return this.recursiveMiniMax(cells, true)[1];
    }

    recursiveMiniMax(cells, player) {

        this.numNodes++;
        let winner = this.getWinner(cells);
        if (winner != null) {
            switch(winner) {
                case 1:
                    // AI wins
                    return [1, cells]
                case 0:
                    // opponent wins
                    return [-1, cells]
                case -1:
                    // Tie
                    return [0, cells];
            }
        } else {
            // Next states
            let nextVal = null;
            let nextCells = null;
            
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (cells[i][j] == null) {
                        cells[i][j] = player;
                        let value = this.recursiveMiniMax(cells, !player)[0];
                        if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                            nextCells = cells.map(function(arr) {
                                return arr.slice();
                            });
                            nextVal = value;
                        }
                        cells[i][j] = null;
                    }
                }
            }
            return [nextVal, nextCells];
        }
    }
}

window.onload = function() {

    let game = new Game();
    game.restart();
};
