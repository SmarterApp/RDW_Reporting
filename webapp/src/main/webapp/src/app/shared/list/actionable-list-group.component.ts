import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListGroupComponent } from './list-group.component';

@Component({
  selector: 'actionable-list-group',
  template: `
    <ng-template #defaultItemTemplate let-item>{{ item }}</ng-template>
    <div class="list-group list-group-sm small">
      <a *ngFor="let item of items"
         href="javascript:void(0)"
         class="list-group-item list-group-item-action"
         (click)="disabled || itemClick.emit(item)">
        <ng-container *ngTemplateOutlet="(itemTemplate ? itemTemplate : defaultItemTemplate);
                      context:{$implicit: item}"></ng-container>
      </a>
    </div>
  `
})
export class ActionableListGroupComponent extends ListGroupComponent {

  @Input()
  disabled: boolean;

  @Output()
  itemClick: EventEmitter<any> = new EventEmitter<any>();

}

