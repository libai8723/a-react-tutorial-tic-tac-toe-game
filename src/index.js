import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
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
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        }
    }

    renderSquare(i) {
        return(
            <Square 
                value={this.state.squares[i]}
                // the below line is important, we have to use this. as prefix
                // because I do a lot try, without this. we cann't access handleClick function
                // and use fat arrow function is also important, because we want 
                // handleClick's 'this' binding to lexical this AKA: current Board instance.
                onClick={() => this.handleClick(i)}
            />
        );
    }

    handleClick(i) {
        // get an copy of squares in state
        const squares = this.state.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        
        squares[i] = this.state.xIsNext?'X':'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if(winner){
            status = 'Winner is: ' + winner 
        }else{
            status = 'Next player: ' + (this.state.xIsNext?'X':'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
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
        }
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
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