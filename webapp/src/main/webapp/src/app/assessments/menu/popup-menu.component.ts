import { Component, Input, ElementRef, Renderer2 } from "@angular/core";
import { PopupMenuAction } from "./popup-menu-action.model";
import { Utils } from "@sbac/rdw-reporting-common-ngx";

/**
 * This component is responsible for displaying a table-row menu button
 * with configurable actions.
 *
 * This component is built using the same styles as the ngx-bootstrap
 * dropdown component, but does not bind a document click listener on
 * instantiation for lightweight display of many menus.
 */
@Component({
  selector: 'popup-menu',
  templateUrl: './popup-menu.component.html'
})
export class PopupMenuComponent {

  @Input()
  public text: string = '';

  @Input()
  public item: any;

  @Input()
  public actions: PopupMenuAction[];

  private _open: boolean;

  private removeListener: () => void;

  constructor(private renderer: Renderer2,
              private domElement: ElementRef) {
  }

  public get hasText(): boolean {
    return !Utils.isNullOrEmpty(this.text);
  }

  public get open(): boolean {
    return this._open;
  }

  /**
   * When opening the menu, bind a click listener to the document to close
   * the menu if the user clicks outside.
   *
   * @param value True to open the menu, false to close
   */
  public set open(value: boolean) {
    if (this._open === value) {
      return;
    }
    this._open = value;
    if (value) {
      this.removeListener = this.renderer.listen(document, 'click', this.onClick.bind(this));
    } else if (!Utils.isNullOrUndefined(this.removeListener)) {
      this.removeListener();
    }
  }

  /**
   * Handle a document click event.  If it is outside of the menu, close the menu.
   *
   * @param event A document click event
   */
  onClick(event: MouseEvent): void {
    this.open = this.domElement.nativeElement.contains(event.target);
  }

  /**
   * Handle an action click, execute the action callback.
   *
   * @param event   The mouse event
   * @param action  The clicked action
   */
  onMenuClick(event: MouseEvent, action: PopupMenuAction): void {
    this.open = false;
    event.preventDefault();

    action.perform(this.item);
  }

}
