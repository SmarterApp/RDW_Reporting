import { Component, Input } from "@angular/core";

const DefaultIconStyles = 'fa-3x';

@Component({
  selector: 'spinner',
  templateUrl: 'spinner.component.html'
})
export class SpinnerComponent {

  @Input()
  text: string;

  private _iconStyles: any = DefaultIconStyles;

  get iconStyles(): any {
    return this._iconStyles;
  }

  @Input()
  set iconStyles(value: any) {
    this._iconStyles = value ? value : DefaultIconStyles;
  }

}
