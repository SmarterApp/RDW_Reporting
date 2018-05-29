import { Component, Input } from "@angular/core";

@Component({
  selector: 'sb-icon',
  template: `
    <i class="icon sbac" 
       [inlineSVG]="svgUrl"></i>
  `
})
export class SBIconComponent {

  @Input()
  icon: string;

  get svgUrl(): string {
    return `/assets/svgs/${this.icon}.svg`
  }
}
