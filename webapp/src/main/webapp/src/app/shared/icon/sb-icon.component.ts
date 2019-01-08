import { Component, Input } from "@angular/core";

@Component({
  selector: 'sb-icon',
  template: `
    <i class="icon sbac"
       [ngClass]="styles"
       [inlineSVG]="'/assets/svgs/' + icon + '.svg'"></i>
  `
})
export class SBIconComponent {

  @Input()
  icon: string;

  @Input()
  styles: any;

}
