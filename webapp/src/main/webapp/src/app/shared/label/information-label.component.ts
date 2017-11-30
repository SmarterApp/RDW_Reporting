import { Component, Input } from "@angular/core";

/**
 * This component is responsible for displaying a label with
 * an information popover icon.
 */
@Component({
  selector: 'info-label,[info-label]',
  templateUrl: './information-label.component.html'
})
export class InformationLabelComponent {

  @Input()
  public title: string;

  @Input()
  public content: string;

}
