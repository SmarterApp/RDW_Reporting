import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScoreTable } from '../score-table/score-table';

@Component({
  selector: 'claim-score-summary',
  templateUrl: './claim-score-summary.component.html',
  styleUrls: ['./claim-score-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimScoreSummaryComponent {
  @Input()
  table: ScoreTable;

  @Input()
  displayCount: boolean;
}
