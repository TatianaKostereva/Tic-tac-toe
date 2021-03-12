import { addElement } from '../helpers/addElement';
import { addStylesForWinLine } from '../helpers/addStylesForWinLine';
import { ActionType, OccupationCellArgs } from '../types';
import { WIN_LENGTH, LINE_WIDTH } from '../constants/constants';
import { sortCoordinates } from '../helpers/sortCoordinates';

class GameView {
  public root: HTMLElement;
  public fieldSize: number;

  constructor(root: HTMLElement, FIELD_SIZE: number) {
    this.root = root;
    this.fieldSize = FIELD_SIZE;
  }

  renderField(action: ActionType): void {
    const div = addElement({
      nameElement: 'div',
      className: 'fieldModel',
      parentElement: this.root,
    });
    const field = addElement({
      nameElement: 'table',
      className: 'field',
      parentElement: div,
    });

    for (let i = 0; i < this.fieldSize; i += 1) {
      const row = addElement({
        nameElement: 'tr',
        className: 'row',
        parentElement: field,
      });

      for (let j = 0; j < this.fieldSize; j += 1) {
        const cell = addElement({
          nameElement: 'td',
          className: 'cell',
          parentElement: row,
        });
        cell.setAttribute('data-x', i.toString());
        cell.setAttribute('data-y', j.toString());

        cell.addEventListener('click', (event: MouseEvent) => {
          const target = event.target as Element;
          const x = target.getAttribute('data-x');
          const y = target.getAttribute('data-y');
          action([Number(x), Number(y)]);
        });
      }
    }
  }

  addRestartGame(name: string, action: () => void) {
    const divDropdownContent = this.root.querySelector<HTMLElement>(
      '.dropdownContent',
    );
    if (divDropdownContent === null) {
      return;
    }

    const firstElementContent = addElement({
      nameElement: 'div',
      className: 'firstElementContent',
      parentElement: divDropdownContent,
    });

    firstElementContent.innerText = name;

    firstElementContent.addEventListener('click', () => {
      const message = this.root.querySelector('.message');
      const line = this.root.querySelector('.line');

      if (message) {
        message.remove();
      }

      if (line) {
        line.remove();
      }

      action();
      divDropdownContent.classList.remove('show');
    });

    this.addFieldSize();
  }

  addSelectPlayer(): number {
    let activePlayer = 0;
    const divDropdownContent = this.root.querySelector<HTMLElement>(
      '.dropdownContent',
    );

    if (divDropdownContent === null) {
      activePlayer = 0;
      return activePlayer;
    }

    const addSelectPlayerField = addElement({
      nameElement: 'div',
      className: 'secondElementContent',
      parentElement: divDropdownContent,
    });

    const selectFirstPlayer = addElement({
      nameElement: 'a',
      className: 'selectFirstPlayer',
      parentElement: addSelectPlayerField,
    });

    selectFirstPlayer.innerText = 'Select first player';

    const selectPlayerDropdownContent = addElement({
      nameElement: 'ul',
      className: 'selectPlayerDropdownContent',
      parentElement: addSelectPlayerField,
    });

    const playerField = addElement({
      nameElement: 'li',
      className: 'playerField',
      parentElement: selectPlayerDropdownContent,
    });

    playerField.innerText = 'Player';

    const computerField = addElement({
      nameElement: 'li',
      className: 'computerField',
      parentElement: selectPlayerDropdownContent,
    });

    computerField.innerText = 'Computer';

    addSelectPlayerField.addEventListener('click', () => {
      selectPlayerDropdownContent.classList.toggle('showMore');
    });

    selectPlayerDropdownContent.addEventListener(
      'click',
      (event: MouseEvent) => {
        const target = event.target as Element;
        if (target !== null && target.className === 'playerField') {
          activePlayer = 0;
          return activePlayer;
        }

        if (target !== null && target.className === 'computerField') {
          activePlayer = 1;
          return activePlayer;
        }
      },
    );
    return activePlayer;
  }

  addFieldSize() {
    const divDropdownContent = this.root.querySelector<HTMLElement>(
      '.dropdownContent',
    );

    if (divDropdownContent === null) {
      return;
    }

    const addFieldSizeField = addElement({
      nameElement: 'div',
      className: 'addFieldSizeField',
      parentElement: divDropdownContent,
    });

    addFieldSizeField.innerText = 'Add Field Size';

    addFieldSizeField.addEventListener('click', () => {
      const divForInput = addElement({
        nameElement: 'div',
        className: 'divForInput',
        parentElement: this.root,
      });

      const input = addElement({
        nameElement: 'input',
        className: 'inputFieldSize',
        parentElement: divForInput,
      }) as Element;

      input.type = 'textarea';
    });
  }

  occupationCell({
    coordinates,
    icon,
    numberOfPlayer,
  }: OccupationCellArgs): void {
    const [x, y] = coordinates;
    const occupationCell = this.root.querySelector<HTMLTableDataCellElement>(
      `[data-x='${x}'][data-y='${y}']`,
    );

    if (!occupationCell) {
      return;
    }

    occupationCell.innerText = icon;
    occupationCell.classList.add(`cell-${numberOfPlayer}`);
  }

  createMessage(messageText: string): void {
    const message = addElement({
      nameElement: 'div',
      className: 'message',
      parentElement: this.root,
    });
    message.innerText = `${messageText}`;
  }

  createLine(coordinates: number[][], indexOfWinLine: number): void {
    const sortedCoordinates = sortCoordinates(coordinates);
    const divForField = this.root.querySelector<HTMLElement>('.fieldModel');

    if (divForField === null) {
      return;
    }

    const line = addElement({
      nameElement: 'div',
      className: 'line',
      parentElement: divForField,
    });

    const startOfLine = this.root.querySelector<HTMLTableDataCellElement>(
      `[data-x='${sortedCoordinates[0][0]}'][data-y='${coordinates[0][1]}']`,
    );

    const endOfLine = this.root.querySelector<HTMLTableDataCellElement>(
      `[data-x='${sortedCoordinates[WIN_LENGTH - 1][0]}'][data-y='${
        coordinates[WIN_LENGTH - 1][1]
      }']`,
    );

    if (startOfLine === null || endOfLine === null) {
      return;
    }

    const coordsOfLineStart = startOfLine.getBoundingClientRect();
    const coordsOfLineEnd = endOfLine.getBoundingClientRect();

    let lengthOfLine = 0;
    const lengthOfGorizontalLine = coordsOfLineEnd.x - coordsOfLineStart.x;
    const lengthOfVerticalLine = coordsOfLineEnd.y - coordsOfLineStart.y;
    const lengthOfDiagonal = Math.sqrt(
      lengthOfGorizontalLine * lengthOfGorizontalLine +
        lengthOfVerticalLine * lengthOfVerticalLine,
    );

    const halfOfWidthCell = coordsOfLineStart.width / 2;
    const halfOfHeightCell = coordsOfLineStart.height / 2;

    switch (indexOfWinLine) {
      case 0: {
        lengthOfLine = lengthOfGorizontalLine;
        const left = coordsOfLineStart.x + halfOfWidthCell;
        const top = coordsOfLineStart.y + halfOfHeightCell - LINE_WIDTH / 2;
        addStylesForWinLine({
          line,
          lengthOfLine,
          top,
          left,
        });
        break;
      }
      case 1: {
        lengthOfLine = lengthOfVerticalLine;
        const left = coordsOfLineStart.x - halfOfWidthCell - LINE_WIDTH / 2;
        const top = coordsOfLineEnd.y - halfOfHeightCell - LINE_WIDTH;
        addStylesForWinLine({
          line,
          lengthOfLine,
          top,
          left,
          degOfRotate: 90,
        });
        break;
      }
      case 2: {
        lengthOfLine = Math.round(lengthOfDiagonal);
        const left = coordsOfLineStart.x + LINE_WIDTH - 2;
        const top = coordsOfLineEnd.y - halfOfHeightCell - LINE_WIDTH;
        addStylesForWinLine({
          line,
          lengthOfLine,
          top,
          left,
          degOfRotate: 45,
        });
        break;
      }
      default: {
        lengthOfLine = Math.round(lengthOfDiagonal);
        const left = coordsOfLineEnd.x + LINE_WIDTH;
        const top = coordsOfLineEnd.y - halfOfHeightCell - LINE_WIDTH;
        addStylesForWinLine({
          line,
          lengthOfLine,
          top,
          left,
          degOfRotate: 135,
        });
        break;
      }
    }
  }

  createMenu(): void {
    const divDropdownMenu = addElement({
      nameElement: 'div',
      className: 'dropdownMenu',
      parentElement: this.root,
    });
    const dropButton = addElement({
      nameElement: 'button',
      className: 'dropButton',
      parentElement: divDropdownMenu,
    });
    const divDropdownContent = addElement({
      nameElement: 'div',
      className: 'dropdownContent',
      parentElement: divDropdownMenu,
    });

    dropButton.innerText = 'Menu';

    dropButton.addEventListener('click', event => {
      divDropdownContent.classList.toggle('show');
    });
    this.addSelectPlayer();
  }

  clearField() {
    const cellElement = Array.from(
      this.root.querySelectorAll<HTMLTableDataCellElement>('.cell'),
    );
    cellElement.forEach(cell => {
      cell.innerText = '';
      cell.classList.remove('cell-0');
      cell.classList.remove('cell-1');
    });
  }

  clearMessage(): void {
    const message = this.root.querySelector('.message');
    if (message) {
      message.remove();
    }
  }

  clearLine(): void {
    const line = this.root.querySelector('.line');
    if (line) {
      line.remove();
    }
  }
}

export { GameView };
