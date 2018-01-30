import { Component, HostListener, Inject, Input } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { WindowRefService } from "../core/window-ref.service";

@Component({
  selector: 'scroll-nav',
  templateUrl: 'scroll-nav.component.html'
})
export class ScrollNavComponent {

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
    }
  }

  private activateSection(sections: Section[], number: number | number): Section {
    // mark all as not active
    for (let section of sections) {
      section.isActive = false;
    }
    let activatedSection: Section;
    for (let section of sections) {
      if (section.isLink) {
        // minus small number (5) since clicking on scroll nav sometimes resulted in the link above the one clicked
        // being highlighted until scrolling down a bit
        if (document.getElementById(section.scrollTo.id).offsetTop - 5 <= number) {
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
}
