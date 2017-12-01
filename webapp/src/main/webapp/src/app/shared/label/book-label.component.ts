import { Component, Input } from "@angular/core";

@Component({
  selector: 'book-label,[book-label]',
  templateUrl: './book-label.component.html'
})
export class BookLabelComponent {

  @Input()
  public title: string;

  @Input()
  public content: string;

}
