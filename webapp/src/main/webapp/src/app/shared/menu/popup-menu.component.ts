import { Component, ElementRef, Input, Renderer2 } from "@angular/core";
import { PopupMenuAction } from "./popup-menu-action.model";
import { Utils } from "../support/support";

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
  template: `
    <div class="btn-group btn-block" [ngClass]="{'open': open}">
      <button type="button"
              (click)="open = !open"
              class="btn btn-info btn-xs btn-block text-left dropdown-toggle label-max-width"
              [attr.title]="hasText ? text : undefined"
              [ngClass]="{'icon-only': !hasText}"
              aria-haspopup="true"
              aria-expanded="false">
        <span class="sr-only">{{'popup-menu' | translate}}</span>
        <i class="fa fa-ellipsis-v" [ngClass]="{'mr-xs': hasText}"></i> {{text}}
      </button>
      <ul *ngIf="open" class="dropdown-menu" role="menu">
        <li *ngFor="let action of actions"
            role="menuitem">
          <ng-container *ngTemplateOutlet="actionTemplate;context:{action: action}"></ng-container>
        </li>
      </ul>
    </div>
    <ng-template #actionTemplate let-action="action">
      <a class="dropdown-item"
         popover="{{action.tooltip(item)}}"
         triggers="{{ action.tooltip(item) == '' ? '': 'mouseenter:mouseleave'}}"
         placement="right"
         container="body"
         [attr.title]="action.displayName( item )"
         [ngClass]="{
             disabled: action.isDisabled(item),
             'dropdown-submenu': getSubActions(action).length
         }"
         href="javascript:void(0)"
         (click)="action.isDisabled(item) || onMenuClick($event, action)">
        <i *ngIf="isSubActionsLoading(action)" class="fa fa-spinner fa-pulse fa-fw"></i>
        {{action.displayName( item )}}
        <ul *ngIf="getSubActions(action).length" class="dropdown-menu">
          <li *ngFor="let subAction of getSubActions(action)"
              role="menuitem"
              [ngClass]="{'dropdown-submenu': getSubActions(subAction).length}">
            <ng-container *ngTemplateOutlet="actionTemplate;context:{action: subAction}"></ng-container>
          </li>
        </ul>
      </a>
    </ng-template>
  `
})
export class PopupMenuComponent {

  @Input()
  public text: string = '';

  @Input()
  public item: any;

  @Input()
  public actions: PopupMenuAction[];

  private _subActions: Map<PopupMenuAction, PopupMenuAction[]> = new Map();
  private _loadedSubActions: Set<PopupMenuAction> = new Set();
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

  public isSubActionsLoading(action: PopupMenuAction): boolean {
    return !this._loadedSubActions.has(action);
  }

  public getSubActions(action: PopupMenuAction): PopupMenuAction[] {
    if (!this._subActions.has(action)) {
      this._subActions.set(action, []);
      action.getSubActions(this.item).subscribe((subActions: PopupMenuAction[]) => {
        this._loadedSubActions.add(action);
        this._subActions.set(action, subActions);
      });
    }
    return this._subActions.get(action);
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
