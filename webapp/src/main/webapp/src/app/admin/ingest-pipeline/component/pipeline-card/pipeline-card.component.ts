import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IngestPipeline } from '../../model/ingest-pipeline';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pipeline-card',
  templateUrl: './pipeline-card.component.html',
  styleUrls: ['./pipeline-card.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineCardComponent {
  @Input()
  pipeline: IngestPipeline;
}
