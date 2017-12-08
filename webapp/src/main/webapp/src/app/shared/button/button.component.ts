import { Component, Input } from "@angular/core";

/**
 * This component is responsible for displaying a button with
 * a specified popover icon.
 */
@Component({
  selector: 'sb-button,[sb-button]',
  templateUrl: './button.component.html'
})
export class ButtonComponent {

  @Input()
  public title: string;

  @Input()
  public content: string;

  @Input()
  public icon: string;

}
