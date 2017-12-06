import { Component, Input } from "@angular/core";
import { ButtonComponent } from "./button.component";

/**
 * This component is responsible for displaying a label with
 * an information popover icon.
 */
@Component({
  selector: 'info-button,[info-button]',
  templateUrl: './information-button.component.html'
})
export class InformationButtonComponent extends ButtonComponent {


}
