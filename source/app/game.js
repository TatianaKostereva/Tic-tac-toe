import './app.scss';
import Computer from './players/computer.js';
import GameObject from './players/gameObject.js';
import { DEFAULT_VALUE, WIN_LENGTH } from './constants/constants.js';

class Game {
  constructor(FIELD_SIZE, view) {
    this.players = [
      new GameObject('X', this),
      new Computer('O', this),
    ];
    this.stepCounter = 0;
    this.activePlayer = -1;
    this.winLength = WIN_LENGTH;
    this.field = {};
    this.fieldSize = FIELD_SIZE;
    this.view = view;
  }

  initGame() {
    this.generateField();
    this.setNextActivePlayer();
    this.view.renderField(this.setStep.bind(this));
  }

  generateField() {
    for (let i = 0; i < this.fieldSize; i += 1) {
      for (let j = 0; j < this.fieldSize; j += 1) {
        this.field[`${i},${j}`] = DEFAULT_VALUE;
      }
    }
  }

  setNextActivePlayer() {
    this.activePlayer = (this.activePlayer === this.players.length - 1) ? 0 : this.activePlayer + 1;
    this.players[this.activePlayer].initSetStep();
  }

  setStep(x, y) {
    if (this.field[`${x},${y}`] !== DEFAULT_VALUE) {
      return false;
    }
    this.stepCounter += 1;
    const { icon } = this.players[this.activePlayer];

    this.field[`${x},${y}`] = this.activePlayer;
    this.view.occupationCell(x, y, icon, this.activePlayer);

    const win = this.checkWin(x, y, this.field);
    if (win) {
      this.stepCounter = 0;
      this.finishGame(win);
    } else {
      this.setNextActivePlayer();
    }

    return true;
  }

  createConfig() {
    const config = {
      horizontal: {
        forward(x, y, quantity) {
          y += quantity;
          return [x, y];
        },
        back(x, y, quantity) {
          y -= quantity;
          return [x, y];
        },
      },
      vertical: {
        forward(x, y, quantity) {
          x += quantity;
          return [x, y];
        },
        back(x, y, quantity) {
          x -= quantity;
          return [x, y];
        },
      },
      diagonal: {
        forward(x, y, quantity) {
          x += quantity;
          y += quantity;
          return [x, y];
        },
        back(x, y, quantity) {
          x -= quantity;
          y -= quantity;
          return [x, y];
        },
      },
      rightDiagonal: {
        forward(x, y, quantity) {
          x -= quantity;
          y += quantity;
          return [x, y];
        },
        back(x, y, quantity) {
          x += quantity;
          y -= quantity;
          return [x, y];
        },
      },
    };

    return config;
  }

  getStepCoordinates(x, y, field, cursorFunction) {
    const coordinates = [];
    for (let i = 1; i < this.winLength; i += 1) {
      const [nextX, nextY] = cursorFunction(x, y, i);
      if (field[`${nextX},${nextY}`] === this.activePlayer) {
        coordinates.push([nextX, nextY]);
      }
    }
    return coordinates;
  }


  getLinesOfStepsCoordinates(x, y, field) {
    const config = this.createConfig();
    const lines = Object.values(config).map((lineConfig) => {
      const stepForwardCoordinates = this
        .getStepCoordinates(x, y, field, lineConfig.forward);
      const stepBackCoordinates = this
        .getStepCoordinates(x, y, field, lineConfig.back);

      return [[x, y]].concat(stepForwardCoordinates, stepBackCoordinates);
    });

    return lines;
  }


  checkWin(x, y, field) {
    const linesOfStepsCoordinates = this.getLinesOfStepsCoordinates(x, y, field);
    const winLine = linesOfStepsCoordinates.find(line => line.length >= this.winLength);

    if (winLine) {
      return {
        numberOfPlayer: this.activePlayer,
        coordinates: winLine,
      };
    }

    if (this.stepCounter === this.fieldSize * this.fieldSize) {
      return 'Draw!';
    }

    return null;
  }

  finishGame(win) {
    if (win === null) {
      return undefined;
    }

    if (win === 'Draw!') {
      this.view.createMessage('Draw!');
      return false;
    }

    if (this.activePlayer === 1) {
      this.view.createMessage('You lost');
      this.view.createLine(win.coordinates);
      return true;
    }
    this.view.createMessage('You won!');
    this.view.createLine(win.coordinates);
    return true;
  }
}

export default Game;
