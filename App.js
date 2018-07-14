import React from 'react';
import { StyleSheet, TouchableOpacity, View, 
  Text as ReactText, Button, List, FlatList, ListItem } from 'react-native';

function Square(props) {
  const {style, value, ...rest} = props;
  return (
    <TouchableOpacity {...rest} style={[styles.cell, style]}><Text>{value}</Text></TouchableOpacity>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onPress={() => this.props.onPress(i)}
      />
    );
  }

  render() {
    return (
      <View style={styles.board}>
        <View style={styles.boardRow}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </View>
        <View style={styles.boardRow}>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </View>
        <View style={styles.boardRow}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </View>
      </View>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return {
      history: [{
        squares: Array(9).fill(""),
        player: null,
        move: null,
      }],
      xIsNext: true,
      viewing: null,
    };
  }

  handlePress(i) {
    const history = this.state.history;
    const squares = history[history.length - 1].squares.slice();
    if(this.state.viewing || calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.xIsNext ? 'X' : '0';
    this.setState({
      history: history.concat({squares: squares, player: squares[i], move: i}), 
      xIsNext: !this.state.xIsNext,
    });
  }

  handleHistoryPress(moveNum) {
    this.setState({viewing: moveNum});
  }

  render() {
    const history = this.state.history;
    const viewing = this.state.viewing;
    const which = viewing || history.length - 1;
    const current = history[which];
    const squares = current.squares;
    const winner = calculateWinner(history[history.length - 1].squares);

    let status;
    if(viewing) status = "Viewing: " + viewing;
    else if (winner) status = "Winner: " + winner;
    else status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    let moves = history.map((step, move) => {
      if(!move) return;
      const desc = `${move}. ${step.player}: ${step.move % 3 + 1},${Math.floor(step.move / 3) + 1}`;
      return (
        <Text key={move} onPress={() => this.handleHistoryPress(move)}>{desc}</Text>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.smallContainer}>
          <Board squares={squares} onPress={(i) => this.handlePress(i)} />
          <View style={{paddingTop: 16}}>
            <Button title={(!winner && viewing) ? "Resume" : "Restart"} onPress={
              () => (!winner && viewing) ? this.setState({viewing: null}) : this.setState(this.initialState())} 
            />
          </View>
        </View>
        <View style={[styles.smallContainer, {justifyContent: 'flex-start', minHeight: 256}]}>
          <Text>{status}</Text>
          {moves}
        </View>
      </View>
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
    [2, 4, 6],
  ];
  for (let ii = 0; ii < lines.length; ++ii) {
    const [a, b, c] = lines[ii];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Text extends React.Component {
  render() {
    const { style, children, ...rest } = this.props;
    return (
      <ReactText {...rest} style={[styles.text, style]}>{children}</ReactText>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  smallContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },
  text: {
    fontSize: 24,
  },
  board: {
    alignItems: 'center',
  },
  boardRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});