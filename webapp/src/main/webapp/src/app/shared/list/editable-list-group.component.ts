import {Component, EventEmitter, Output} from "@angular/core";
import {ListGroupComponent} from "./list-group.component";

@Component({
  selector: 'editable-list-group',
  template: `
    <ng-template #defaultItemTemplate let-item>{{ item }}</ng-template>
    <ul class="list-group list-group-sm small">
      <li *ngFor="let item of items"
          class="list-group-item">
        <a *ngIf="!disabled"
           class="mr-xs"
           href="javascript:void(0)"
           (click)="itemRemoveButtonClick.emit(item)"><i class="fa fa-close"></i></a>
        <ng-container *ngTemplateOutlet="(itemTemplate ? itemTemplate : defaultItemTemplate);
                      context:{$implicit: item}"></ng-container>
      </li>
    </ul>
  `
})
export class EditableListGroupComponent extends ListGroupComponent {

  @Output()
  itemRemoveButtonClick: EventEmitter<any> = new EventEmitter<any>();

}

