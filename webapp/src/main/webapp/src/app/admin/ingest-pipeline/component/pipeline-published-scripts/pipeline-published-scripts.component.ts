import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  Pipeline,
  PipelineScript,
  PublishedPipeline
} from '../../model/pipeline';

export interface PublishedPipelineView extends PublishedPipeline {
  active: boolean;
}

@Component({
  selector: 'pipeline-published-scripts',
  templateUrl: './pipeline-published-scripts.component.html',
  styleUrls: ['./pipeline-published-scripts.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelinePublishedScriptsComponent {
  @Input()
  pipeline: Pipeline;

  @Input()
  pipelines: PublishedPipelineView[];

  @Input()
  selectedPipeline: PublishedPipelineView;

  @Output()
  pipelineSelect: EventEmitter<PublishedPipelineView> = new EventEmitter();
}
