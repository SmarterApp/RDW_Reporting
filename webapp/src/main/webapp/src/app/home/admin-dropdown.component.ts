import { Component } from "@angular/core";

@Component({
  selector: 'admin-dropdown',
  templateUrl: './admin-dropdown.component.html'
})
export class AdminDropdownComponent {

  expanded: boolean = false;

  toggle() {
    this.expanded = !this.expanded;
  }
}
