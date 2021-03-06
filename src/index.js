import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.highLighted?"square highLighted":"square"}
            // here is something slightly different with tutorials
            // in the tutorials they use another arrow function to encapsulate this.props.onClick()
            // but i don't think that is necessary, 
            // because onClick on expect a function, and this.props.onClick is already a function
            // why bother to encapsulate it again? And this works
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                // the below line is important, we have to use this. as prefix
                // because I do a lot try, without this. we cann't access handleClick function
                // and use fat arrow function is also important, because we want 
                // handleClick's 'this' binding to lexical this AKA: current Board instance.
                // the arrow function below, accept no parameter, this is important
                // once I add a 'i' as the parameter, this leads to error, i becomes the event
                onClick={() => this.props.onClick(i)}
                highLighted = {this.highLighted(i)}
            />
        );
    }

    makeSquares() {
        let board = []
        for (let row = 0; row < 3; row++) {
            let row_cell = [];
            for (let col = 0; col < 3; col++) {
                row_cell.push(this.renderSquare(row * 3 + col))
            }
            board.push(<div key={row} className="board-row">{row_cell}</div>)
        }
        return <div>{board}</div>
    }

    // calculate whether a square should be high lighted
    highLighted(i) {
        for (let index = 0; index < this.props.WinnerSquares.length; index++) {
            if (this.props.WinnerSquares[index] === i) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            this.makeSquares()
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // every history state in the board
            history: [{
                squares: Array(9).fill(null),
            }],
            // is X for next move?
            xIsNext: true,
            // current step number, mainly used in time travel
            stepNumber: 0,
            // every move in history, used to show coordinate location for each move
            moves: [{
                sequenceNo: 0,
                who: null,
                row: null,
                col: null
            }],
            // whether show moves in ASC sequence
            asc: true,
            // the winner's three squares
            WinSquaresHistory: [{
                sequences: [null, null, null]
            }]
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const moves = this.state.moves.slice(0, this.state.stepNumber + 1);
        const WinnerSquares = this.state.WinSquaresHistory.slice(0, this.state.stepNumber + 1);

        const current = history[history.length - 1];
        // get an copy of squares in state
        const squares = current.squares.slice();
        // if a square has been Occupied then do nothing
        // if already has a winner then do nothing
        if (squares[i] || calculateWinner(squares)) {
            return;
        }

        // fill a square with X or O
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        // calc the 3 winner squares
        let winSquares = [null, null, null];
        if(calculateWinner(squares)) {
            winSquares = CalcWinnerSquares(squares);
        }
        
        this.setState({
            history: history.concat(
                [{ squares: squares }]
            ),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            moves: moves.concat(
                [{
                    sequenceNo: history.length,
                    who: this.state.xIsNext?'X':'O',
                    row: Math.floor(i / 3) + 1,
                    col: i % 3 + 1,
                }]
            ),
            WinSquaresHistory: WinnerSquares.concat(
                [{sequences: winSquares}]
            ),
        });
    }

    /**
     * handle the click event of ASC checkbox
     */
    handleSequence(evt) {
        console.log(arguments);
        console.log(evt.target.checked);
        this.setState({
            asc: evt.target.checked
        });
    }

    /**
     * construct a array of react elements in asc or desc order
     * @param {boolean parameter whether we choose asc} asc 
     */
    construtMovesInSequence(asc) {
        // make a copy of moves in state
        const moves = this.state.moves.slice();

        if(asc){
            moves.reverse();
        }
        return moves.map((move) => {
            const desc = (move.sequenceNo ?
                'Go #' + move.sequenceNo + " " + move.who + " at (" + move.row + "," + move.col + ")" :
                'Go to game start');
            return (
                <li key={move.sequenceNo}>
                    <button 
                        onClick={() => this.jumpTo(move.sequenceNo)}
                        className={move.sequenceNo === this.state.stepNumber?'selected-move':''}
                    >
                        {desc}
                    </button>
                </li>
            );
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const WinSquaresHistory = this.state.WinSquaresHistory;
        const currentWinSquares = WinSquaresHistory[this.state.stepNumber];

        const winner = calculateWinner(current.squares);

        const moves = this.construtMovesInSequence(this.state.asc);

        let status;
        if (winner === 'X' || winner === 'O') {
            status = 'Winner: ' + winner;
        } else if(winner === 'draw') {
            status = 'Draw game, play again.';
        } 
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        WinnerSquares={currentWinSquares.sequences}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <input 
                            type="checkbox" 
                            name="move-sequence" 
                            id="move-sequence-id"
                            checked={this.state.asc}
                            onChange={(evt) => this.handleSequence(evt)}
                        />
                        <label htmlFor="move-sequence-id">ASC</label>
                    </div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// add a function to determine whethe game is ended
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    let OccupiedSquaresNumber = 0;
    for (let index = 0; index < squares.length; index++) {
        const element = squares[index];
        if(element === 'X' || element === 'O') {
            OccupiedSquaresNumber += 1;
        }
    }
    if(OccupiedSquaresNumber >= 9) {
        return 'draw';
    }
    return null;
}

// return the winner's 3 squares
function CalcWinnerSquares(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return [null, null, null];
}