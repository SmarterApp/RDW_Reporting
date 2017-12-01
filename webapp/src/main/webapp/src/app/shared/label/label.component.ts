import { Component, Input, OnInit } from "@angular/core";

/**
 * This component is responsible for displaying a label with
 * a specified popover icon.
 */
@Component({
  selector: 'sb-label,[sb-label]',
  templateUrl: './label.component.html'
})
export class LabelComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public content: string;

  @Input()
  public icon: string;

  ngOnInit() {
    if (null == this.icon) throw new Error("Attribute 'icon' is required");
  }

}
