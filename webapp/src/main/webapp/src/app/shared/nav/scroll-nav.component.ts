import { Component, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRefService } from '../core/window-ref.service';
import { Utils } from '../support/support';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'scroll-nav',
  templateUrl: 'scroll-nav.component.html'
})
export class ScrollNavComponent {

  private _items: ScrollNavItem[] = [];
  private _activeItem: ScrollNavItem;
  private _window: Window;
  private _enabled = true;

  constructor(private translateService: TranslateService,
              private windowRef: WindowRefService,
              @Inject(DOCUMENT) private _document: Document) {
    this._window = windowRef.nativeWindow;
  }

  get items(): ScrollNavItem[] {
    return this._items;
  }

  @Input()
  set items(items: ScrollNavItem[]) {
    if (this._items !== items) {
      this._items = Utils.isNullOrEmpty(items)
        ? []
        : items.map((item) => {

          //Saturate element reference from id
          if (Utils.isNullOrUndefined(item.scrollTo)
            && !Utils.isNullOrUndefined(item.id)) {
            item = Object.assign({}, item, {
              scrollTo: document.getElementById(item.id)
            });
          }

          //Saturate text from translation key
          if (Utils.isNullOrUndefined(item.text)
            && !Utils.isNullOrUndefined(item.translationKey)) {
            item = Object.assign({}, item, {
              text: this.translateService.instant(item.translationKey)
            });
          }

          return item;
        });
    }
  }

  ngOnInit(): void {
    if (!this.activeItem && this.items.length) {
      this._activeItem = this.items[ 0 ];
    }
  }

  get activeItem(): ScrollNavItem {
    return this._activeItem;
  }

  @Input()
  set activeItem(item: ScrollNavItem) {
    this._activeItem = item;
    if (item.scrollTo) {
      item.scrollTo.scrollIntoView();
    }
  }

  onItemClickInternal(item: ScrollNavItem): void {
    this.activeItem = item;
    if (item.click) {
      item.click();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this._enabled && this.updateActiveLink();
  }

  private updateActiveLink(): void {

    // Sets the first item to active if the window scroll is zero
    if (this._window.scrollY <= 0) {
      this._activeItem = this.items[ 0 ];
    }

    // Sets the last item to active if the user scrolls to the very bottom of the page
    if ((this._window.innerHeight + this._window.scrollY) >= this._document.body.offsetHeight) {
      this._activeItem = this.items[ this.items.length - 1 ];
      return;
    }

    const scrollTop = this.getWindowPageYOffset();

    // document.getElementById(item.scrollTo.id) is a HOTFIX for offsetTop javascript error
    // ngOnDestroy is not called in this component because it belongs to a "reusable" view
    // Angular does not currently support removal of global host listeners
    this.items
      .filter(item => item.scrollTo && document.getElementById(item.scrollTo.id))
      .forEach(item => {
        const itemOffsetTop = Utils.getAbsoluteOffsetTop(item.scrollTo);
        if (itemOffsetTop <= scrollTop) {
          this._activeItem = item;
        } else {
          return;
        }
      });
  }

  /**
   * Gets the window's page y offset in a cross-browser compliant manner
   *
   * @returns {number} the windows page y offset
   */
  private getWindowPageYOffset(): number {
    return this._window.pageYOffset
      || this._document.documentElement.scrollTop
      || this._document.body.scrollTop
      || 0;
  }

}

export interface ScrollNavItem {
  readonly click?: any;
  readonly scrollTo?: Element;
  readonly id?: string;
  readonly text?: string;
  readonly translationKey?: string;
  readonly classes?: string;
  readonly iconClasses?: string;
}
