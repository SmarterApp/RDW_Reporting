import { Component, Input } from "@angular/core";

/**
 * This component is responsible for displaying values that might be missing and need a default display
 */
@Component({
  selector: 'display-optional',
  templateUrl: './display-optional.component.html',
})
export class DisplayOptionalComponent {

  @Input()
  public value: any;

  @Input()
  public displayValue: any = null;

  @Input()
  public missingValue: string = '&mdash;';

  get display(): any {
    if (this.value === null) return this.missingValue;

    return this.displayValue === null ? this.value : this.displayValue;
  }
}
