import { Component, Input } from "@angular/core";

@Component({
  selector: 'admin-dropdown',
  templateUrl: './admin-dropdown.component.html'
})
export class AdminDropdownComponent {

  @Input()
  buttonStyles: string;
}
