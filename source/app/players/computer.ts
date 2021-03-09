import { DEFAULT_VALUE } from '../constants/constants';
import { createConfigForCheckSetStep } from '../helpers/createConfigForCheckSetStep';
import {
  CoordinatesType,
  GetPossibleStepCoordinatesArgs,
} from '../types';
import type { Game } from '../game';

class Computer {
  public icon: string;
  public game: Game;

  constructor(icon: string, game: Game) {
    this.icon = icon;
    this.game = game;
  }

  getPossibleStepCoordinates({
    coordinates,
    quantity,
    cursorFunction,
  }: GetPossibleStepCoordinatesArgs): CoordinatesType[] {
    const coordinatesArr: CoordinatesType[] = [];
    const [nextX, nextY] = cursorFunction(coordinates, quantity);
    if (this.game.field[`${nextX},${nextY}`] === DEFAULT_VALUE) {
      coordinatesArr.push([nextX, nextY]);
    }
    return coordinatesArr;
  }

  getCoordinatesFromCoordinatesOfPlayer(
    coordinates: CoordinatesType,
  ): CoordinatesType[] {
    const config = createConfigForCheckSetStep();
    const arrOflinesWithCoordinates = Object.values(config).map(lineConfig => {
      const stepForwardCoordinates = this.getPossibleStepCoordinates({
        coordinates,
        quantity: 1,
        cursorFunction: lineConfig.forward,
      });
      const stepBackCoordinates = this.getPossibleStepCoordinates({
        coordinates,
        quantity: 1,
        cursorFunction: lineConfig.back,
      });

      return stepForwardCoordinates.concat(stepBackCoordinates);
    });

    const arrWithCoordinates = arrOflinesWithCoordinates.reduce(
      (acc, line) => acc.concat(line),
      [],
    );

    const randomNumber = Math.floor(Math.random() * arrWithCoordinates.length);

    const cellForStep = arrWithCoordinates[randomNumber];
    const [x, y] = cellForStep;
    this.game.setStep([x, y]);

    return arrWithCoordinates;
  }
}

export { Computer };
