import { Injectable } from "@angular/core";
import { Angular2Csv } from "angular2-csv";

/**
 * This provider wraps the Angular2Csv library.
 */
@Injectable()
export class Angular2CsvProvider {

  /**
   * Export the given data as a CSV using the Angular2Csv library.
   *
   * @param data      The csv data
   * @param filename  The export filename
   */
  export(data: string[][], filename: string) {
    new Angular2Csv(data, filename);
  }
}
