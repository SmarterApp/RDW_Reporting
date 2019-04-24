import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Pipeline, PipelineTest } from '../../model/pipeline';

export type ItemType = 'Script' | 'Test';

export interface Item<T = any> {
  type: ItemType;
  value: T;
}

@Component({
  selector: 'pipeline-explorer',
  templateUrl: './pipeline-explorer.component.html',
  styleUrls: ['./pipeline-explorer.component.less']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineExplorerComponent {
  @Input()
  selectedItem: Item;

  @Output()
  itemSelected: EventEmitter<Item> = new EventEmitter();

  @Output()
  createTestButtonClick: EventEmitter<void> = new EventEmitter();

  @Output()
  deleteTestButtonClick: EventEmitter<PipelineTest> = new EventEmitter();

  _scriptItems: Item<Pipeline>[] = [];
  _testItems: Item<PipelineTest>[] = [];

  @Input()
  set items(values: Item[]) {
    this._scriptItems = values.filter(({ type }) => type === 'Script');
    this._testItems = values.filter(({ type }) => type === 'Test');
  }

  onItemClick(item: Item, element: HTMLElement): void {
    this.itemSelected.emit(item);
    element.scrollIntoView({
      behavior: 'auto',
      block: 'nearest'
    });
  }
}
