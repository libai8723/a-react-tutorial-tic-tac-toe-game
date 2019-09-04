import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
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
                value={this.props.squares[i]}
                // the below line is important, we have to use this. as prefix
                // because I do a lot try, without this. we cann't access handleClick function
                // and use fat arrow function is also important, because we want 
                // handleClick's 'this' binding to lexical this AKA: current Board instance.
                // the arrow function below, accept no parameter, this is important
                // once I add a 'i' as the parameter, this leads to error, i becomes the event
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            moves: [{
                who: null,
                row: null,
                col: null
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
        const current = history[history.length - 1];
        // get an copy of squares in state
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat(
                [{ squares: squares }]
            ),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            moves: moves.concat(
                [{
                    who: this.state.xIsNext?'X':'O',
                    row: Math.ceil(i / 3),
                    col: i % 3 + 1,
                }]
            ),
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = this.state.moves.map((move, idx) => {
            const desc = (idx ?
                'Go #' + idx + " " + move.who + " at (" + move.row + "," + move.col + ")" :
                'Go to game start');
            return (
                <li key={idx}>
                    <button onClick={() => this.jumpTo(idx)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
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
    return null;
}