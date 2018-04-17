import {Component, Input, TemplateRef} from "@angular/core";

@Component({
  selector: 'list-group',
  template: `
    <ng-template #defaultItemTemplate let-item>{{item}}</ng-template>
    <ul class="list-group list-group-sm small">
      <li *ngFor="let item of items"
          class="list-group-item">
        <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
                                         context:{$implicit: item}"></ng-container>
      </li>
    </ul>
  `
})
export class ListGroupComponent {

  @Input()
  itemTemplate: TemplateRef<any>;

  @Input()
  disabled = false;

  private _items: any[] = [];

  get items(): any[] {
    return this._items;
  }

  @Input()
  set items(items: any[]) {
    this._items = items ? items.concat() : [];
  }

}

