import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pipeline } from '../../model/pipeline';
import { PipelineService } from '../../service/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { PublishedPipelineView } from '../../component/pipeline-published-scripts/pipeline-published-scripts.component';

@Component({
  selector: 'pipeline-publishing-history',
  templateUrl: './pipeline-publishing-history.component.html'
})
export class PipelinePublishingHistoryComponent {
  pipeline: BehaviorSubject<Pipeline> = new BehaviorSubject(undefined);
  pipelines: Observable<PublishedPipelineView[]>;
  selectedPipeline: PublishedPipelineView;

  constructor(
    private pipelineService: PipelineService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pipelineId = this.route.params.pipe(map(({ id }) => Number(id)));
    this.pipelines = this.pipeline.pipe(
      mergeMap(pipeline =>
        this.pipelineService.getPublishedPipelines(pipeline.code).pipe(
          map(serverPipelines =>
            serverPipelines.map(serverPipeline => ({
              ...serverPipeline,
              active: pipeline.activeVersion === serverPipeline.version
            }))
          )
        )
      ),
      tap(([first]) => {
        this.selectedPipeline = first;
      })
    );

    pipelineId
      .pipe(mergeMap(id => this.pipelineService.getPipeline(id)))
      .subscribe(value => this.pipeline.next(value));
  }

  onPipelineSelect(pipeline: PublishedPipelineView): void {
    this.selectedPipeline = pipeline;
  }

  onPipelineActivate(pipeline: Pipeline): void {
    this.pipelineService.updatePipeline(pipeline).subscribe(value => {
      this.pipeline.next(value);
    });
  }
}
