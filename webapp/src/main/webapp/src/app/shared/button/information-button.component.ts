import { Component, Input } from "@angular/core";

/**
 * This component is responsible for displaying a label with
 * an information popover icon.
 */
@Component({
  selector: 'info-button,[info-button]',
  templateUrl: './information-button.component.html'
})
export class InformationButtonComponent {

  @Input()
  public title: string;

  @Input()
  public content: string;

  @Input()
  public icon: string;

}
