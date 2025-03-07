import { Component } from "react";
import { pole } from "./pole";
import styles from "./style.module.css";
import { FaTimes } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pole: JSON.parse(localStorage.getItem("gameState")) || pole,
      moveCount: parseInt(localStorage.getItem("moveCount")) || 0,
      winner: localStorage.getItem("winner") || null,
    };
  }

  checkWinner = (pole) => {
    // Проверка по горизонтали и вертикали
    for (let i = 0; i < 3; i++) {
      if (
        pole[i][0] !== "" &&
        pole[i][0] === pole[i][1] &&
        pole[i][0] === pole[i][2]
      ) {
        return pole[i][0];
      }
      if (
        pole[0][i] !== "" &&
        pole[0][i] === pole[1][i] &&
        pole[0][i] === pole[2][i]
      ) {
        return pole[0][i];
      }
    }

    // Проверка диагоналей
    if (
      pole[0][0] !== "" &&
      pole[0][0] === pole[1][1] &&
      pole[0][0] === pole[2][2]
    ) {
      return pole[0][0];
    }
    if (
      pole[0][2] !== "" &&
      pole[0][2] === pole[1][1] &&
      pole[0][2] === pole[2][0]
    ) {
      return pole[0][2];
    }

    // Проверка на ничью
    const isDraw = pole.every((row) => row.every((cell) => cell !== ""));
    if (isDraw) return "draw";

    return null;
  };

  handleClick = (i, j) => {
    if (this.state.winner || this.state.pole[i][j] !== "") {
      return;
    }

    const newPole = [...this.state.pole];
    const newMoveCount = this.state.moveCount + 1;
    newPole[i][j] = newMoveCount % 2 === 0 ? "O" : "X";

    const winner = this.checkWinner(newPole);

    localStorage.setItem("gameState", JSON.stringify(newPole));
    localStorage.setItem("moveCount", newMoveCount.toString());
    localStorage.setItem("winner", winner || "");

    this.setState({
      pole: newPole,
      moveCount: newMoveCount,
      winner: winner,
    });
  };

  clearGame = () => {
    const emptyPole = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    localStorage.setItem("gameState", JSON.stringify(emptyPole));
    localStorage.setItem("moveCount", "0");
    localStorage.setItem("winner", "");
    this.setState({
      pole: emptyPole,
      moveCount: 0,
      winner: null,
    });
  };

  renderSymbol = (value) => {
    switch (value) {
      case "X":
        return <FaTimes className={styles.cross} />;
      case "O":
        return <BsCircleFill className={styles.circle} />;
      default:
        return null;
    }
  };

  renderWinnerMessage = () => {
    if (!this.state.winner) return null;
    if (this.state.winner === "draw") {
      return `Ничья!`;
    }
    return `Победитель: ${this.state.winner}!`;
  };

  render() {
    return (
      <div className={styles.container}>
        {this.state.winner && (
          <div className={styles.winner}>{this.renderWinnerMessage()}</div>
        )}
        {this.state.pole.map((row, i) => (
          <div className={styles.row} key={i}>
            {row.map((cell, j) => (
              <button
                className={styles.Yacheyka}
                key={j}
                onClick={() => this.handleClick(i, j)}
              >
                {this.renderSymbol(cell)}
              </button>
            ))}
          </div>
        ))}

        <button className={styles.clearButton} onClick={this.clearGame}>
          Очистить поле
        </button>
      </div>
    );
  }
}

export default Main;
