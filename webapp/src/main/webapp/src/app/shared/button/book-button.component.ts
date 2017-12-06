import { Component, Input } from "@angular/core";
import { ButtonComponent } from "./button.component";

@Component({
  selector: 'book-button,[book-button]',
  templateUrl: './book-button.component.html'
})
export class BookButtonComponent extends ButtonComponent {

}
