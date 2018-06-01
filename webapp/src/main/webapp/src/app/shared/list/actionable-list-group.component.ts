import { Component, EventEmitter, Output } from '@angular/core';
import { ListGroupComponent } from './list-group.component';

@Component({
  selector: 'actionable-list-group',
  template: `
    <ng-template #defaultItemTemplate let-item>{{ item }}</ng-template>
    <div class="list-group list-group-sm small">
      <a *ngFor="let item of items"
         class="list-group-item list-group-item-action"
         href="javascript:void(0)"
         (click)="itemClick.emit(item)">
        <ng-container *ngTemplateOutlet="(itemTemplate ? itemTemplate : defaultItemTemplate);
                      context:{$implicit: item}"></ng-container>
      </a>
    </div>
  `
})
export class ActionableListGroupComponent extends ListGroupComponent {

  @Output()
  itemClick: EventEmitter<any> = new EventEmitter<any>();

}

