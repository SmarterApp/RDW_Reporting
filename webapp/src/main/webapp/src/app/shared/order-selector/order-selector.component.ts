import { Component, EventEmitter, Input, Output } from "@angular/core";

/**
 * This component is responsible for displaying a UX to allow the user
 * to arbitrarily order a collection of items.
 */
@Component({
  selector: 'order-selector',
  templateUrl: 'order-selector.component.html'
})
export class OrderSelectorComponent {

  @Input()
  public items: OrderableItem[];

  @Output()
  public itemsChange: EventEmitter<OrderableItem[]> = new EventEmitter();

  public selectedItem: OrderableItem;
  public selectedIdx: number;

  public selectItem(item: OrderableItem) {
    this.selectedItem = item;
    this.selectedIdx = this.items.indexOf(this.selectedItem);
  }

  /**
   * Move the selected item to the left.
   */
  public moveLeft(): void {
    this.items.splice(this.selectedIdx - 1, 0, this.items.splice(this.selectedIdx, 1)[0]);
    this.selectedIdx--;
    this.itemsChange.emit(this.items);
  }

  /**
   * Move the selected item to the right.
   */
  public moveRight(): void {
    this.items.splice(this.selectedIdx + 1, 0, this.items.splice(this.selectedIdx, 1)[0]);
    this.selectedIdx++;
    this.itemsChange.emit(this.items);
  }

  public onDrag() {
    this.selectedIdx = undefined;
    this.selectedItem = undefined;
  }

  public onDrop() {
    this.itemsChange.emit(this.items);
  }
}

/**
 * This interface represents an orderable item.
 */
export interface OrderableItem {
  //The item value
  value: any;

  //The display text for the item.
  //Do not supply both a label and translation labelKey
  label?: string;

  //The translation label key for the item.
  //Do not supply both a label and a translation labelKey
  labelKey?: string;
}
