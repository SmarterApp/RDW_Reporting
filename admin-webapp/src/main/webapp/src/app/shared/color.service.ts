import { Injectable } from "@angular/core";

/**
 * This service is responsible for transforming an arbitrary number
 * into a color value.
 */
@Injectable()
export class ColorService {

  private colors: string[] = [
    'teal',
    'green',
    'orange',
    'blue-dark',
    'maroon',
    'green-dark',
    'blue-dark'
  ];

  /**
   * Retrieve the color for the given index.
   *
   * @param valueIndex an unbounded index
   */
  getColor(valueIndex: number): string {
    let idx: number = valueIndex % this.colors.length;
    return this.colors[idx];
  }
}
