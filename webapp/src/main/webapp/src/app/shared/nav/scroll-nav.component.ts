import { Component, HostListener, Inject, Input } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { WindowRefService } from "../core/window-ref.service";
import { Utils } from "../support/support";

@Component({
  selector: 'scroll-nav',
  templateUrl: 'scroll-nav.component.html'
})
export class ScrollNavComponent {

  private _items: ScrollNavItem[] = [];
  private _activeItem: ScrollNavItem;
  private _window: Window;
  private _enabled = true;

  constructor(private windowRef: WindowRefService,
              @Inject(DOCUMENT) private _document: Document) {
    this._window = windowRef.nativeWindow;
  }

  get items(): ScrollNavItem[] {
    return this._items;
  }

  @Input()
  set items(items: ScrollNavItem[]) {
    if (this._items !== items) {
      this._items = Utils.isNullOrEmpty(items) ? [] : items.concat();
    }
  }

  get activeItem(): ScrollNavItem {
    return this._activeItem;
  }

  onItemClickInternal(item: ScrollNavItem): void {
    item.scrollTo && item.scrollTo.scrollIntoView();
    item.click && item.click();
  }

  private getScrollTop(): number {
    return this._window.pageYOffset || this._document.documentElement.scrollTop || this._document.body.scrollTop || 0;
  }

  @HostListener("window:scroll", [])
  onWindowScroll(): void {
    this._enabled && this.updateActiveLink();
  }

  private updateActiveLink(): void {
    const scrollTop = this.getScrollTop();
    this.items
    // TODO clean up or use a 3rd party lib if possible
    // document.getElementById(item.scrollTo.id) is a HOTFIX for offsetTop javascript error
    // ngOnDestroy is not called in this component because it belongs to a "reusable" view
    // Angular does not currently support removal of global host listeners
      .filter(item => item.scrollTo && document.getElementById(item.scrollTo.id))
      .forEach(item => {
        const scrollItem = document.getElementById(item.scrollTo.id);
        const itemOffsetTop = scrollItem.offsetTop;

        // minus small number (20) since clicking on scroll nav sometimes resulted in the link above the one clicked
        // being highlighted until scrolling down a bit
        if (itemOffsetTop - 20 <= scrollTop) {
          this._activeItem = item;
        } else {
          return;
        }
      });
    if (!this.activeItem && this.items.length) {
      this._activeItem = this.items[0];
    }
  }
}

export interface ScrollNavItem {
  readonly click?: any;
  readonly scrollTo?: Element;
  readonly text: string;
  readonly classes?: string;
  readonly iconClasses?: string;
}
