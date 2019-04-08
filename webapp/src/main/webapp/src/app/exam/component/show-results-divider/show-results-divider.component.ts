import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'show-results-divider',
  templateUrl: './show-results-divider.component.html',
  styleUrls: ['./show-results-divider.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowResultsDividerComponent {
  @Input()
  collapsed: boolean;

  @Output()
  collapsedChanged: EventEmitter<boolean> = new EventEmitter();
}
