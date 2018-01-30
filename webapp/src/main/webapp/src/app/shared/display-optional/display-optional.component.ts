import { Component, Input } from "@angular/core";

/**
 * This component is responsible for displaying values that might be missing and need a default display
 */
@Component({
  selector: 'display-optional',
  templateUrl: './display-optional.component.html',
})
export class DisplayOptionalComponent {

  /**
   * The value to check when determining whether to display a value or the missing value.
   */
  @Input()
  public value: any;

  /**
   * The display value that will be used instead of the value for display purposes if provided.
   * @type {null}
   */
  @Input()
  public displayValue: any = null;

  /**
   * If value is null then this missing value will be shown.  Defaults to a dash.
   * @type {string}
   */
  @Input()
  public missingValue: string = '&mdash;';

  /**
   * Returns the value to display based on if it is null
   * @returns {any}
   */
  get display(): any {
    if (this.value === null) return this.missingValue;

    return this.displayValue === null ? this.value : this.displayValue;
  }
}
