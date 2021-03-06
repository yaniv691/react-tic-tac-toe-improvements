import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	const isWinningSquare = props.isWinningSquare ? 'winning-square' : '';
	return (
		<button onClick={props.onClick} className={`square ${isWinningSquare}`}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i, y, x, isWinningSquare) {
		return (
			<Square
				key={i}
				isWinningSquare={isWinningSquare}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i, y, x)}
			/>
		);
	}

	render() {
		let board = [];
		let squares;
		let col = 1;
		let row = 1;
		let isWinningSquare;
		for (let i = 0; i < 9; i += 3) {
			squares = [];
			for (let j = 0; j < 3; j++) {
				if (this.props.winningLine) {
					isWinningSquare = this.props.winningLine.includes(i + j)
						? true
						: false;
				}
				squares.push(this.renderSquare(i + j, col, row, isWinningSquare));
				col++;
			}
			row++;
			col = 1;
			board.push(
				<div key={i} className="board-row">
					{squares}
				</div>
			);
		}
		return <div>{board}</div>;
	}
}

class Game extends React.Component {
	handleClick(i, col, row) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([
				{
					squares: squares,
					move: `${this.state.xIsNext ? 'X' : 'O'}  (${col}, ${row})`
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0
		});
	}

	sortMovesToggle() {
		const history = this.state.history.slice();
		this.setState({
			history: history.reverse(),
			isSortDirectionAsc: !this.state.isSortDirectionAsc
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			stepNumber: 0,
			xIsNext: true,
			isSortDirectionAsc: true
		};
	}
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			let sortedMove = this.state.isSortDirectionAsc
				? move
				: history.length - 1 - move;

			const desc = sortedMove
				? `Go to move #${sortedMove} - ${step.move}`
				: 'Go to game start';
			return (
				<li
					key={move}
					className={move === this.state.stepNumber ? 'current-move' : ''}
				>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status = winner
			? `Winner: ${winner.winningChar}`
			: history.length === 10
			? 'Draw'
			: `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

		return (
			<div className="game">
				<div className="game-board">
					<Board
						winningLine={winner ? winner.winningLine : null}
						squares={current.squares}
						onClick={(i, col, row) => this.handleClick(i, col, row)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
					<button onClick={() => this.sortMovesToggle()}>
						Sort Moves {!this.state.isSortDirectionAsc ? 'ASC' : 'DESC'}
					</button>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				winningLine: lines[i],
				winningChar: squares[a]
			};
		}
	}
	return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
