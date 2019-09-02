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
        
        squares[i] = this.state.xIsNext?'X':'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const status = 'Next player: ' + (this.state.xIsNext?'X':'O');

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
