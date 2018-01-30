import { Component, HostListener, Inject, Input } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { WindowRefService } from "../core/window-ref.service";

@Component({
  selector: 'left-nav',
  templateUrl: 'left-nav.component.html'
})
export class LeftNavComponent {

  @Input()
  sections: Section[] = [];
  private window: Window;

  constructor(@Inject(DOCUMENT) private document: Document,
              private windowRef: WindowRefService) {
    this.window = windowRef.nativeWindow;
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    let activatedSection = this.activateSection(this.sections, number);

    if (activatedSection) {
      activatedSection.isActive = true;
      if (activatedSection.subsections) {
        let activatedSubsection = this.activateSection(activatedSection.subsections, number - document.getElementById(activatedSection.scrollTo.id).offsetTop);
        if (activatedSubsection)
         activatedSubsection.isActive = true;
      }
    }
  }

  private activateSection(sections: Section[], number: number | number): Section {
    for (let section of sections) {
      section.isActive = false;
    }
    let activatedSection: Section;
    for (let section of sections) {
      if (section.isLink) {
        if (document.getElementById(section.scrollTo.id).offsetTop <= number) {
          activatedSection = section;
        } else {
          break;
        }
      }
    }
    return activatedSection;
  }
}

class Section {
  clickAction?: any;
  scrollTo?: Element;
  isActive: boolean = false;
  text: string;
  type: string;
  isLink: boolean = false;
  isButton?: boolean = false;
  classes?: string;
  iconClasses?: string;
  subsections?: Section[];
}
