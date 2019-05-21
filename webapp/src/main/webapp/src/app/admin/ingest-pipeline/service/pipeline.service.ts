import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { Observable } from 'rxjs';
import {
  Pipeline,
  PipelineScript,
  PipelineTest,
  PipelineTestRun,
  PublishedPipeline,
  ScriptError
} from '../model/pipeline';
import { map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../../shared/service-route';

const ResourceRoute = `${AdminServiceRoute}/pipelines`;
const PublishedPipelinesRoute = `${AdminServiceRoute}/publishedPipelines`;

function toPipelineScript(serverScript: any): PipelineScript {
  return {
    id: serverScript.id,
    pipelineId: serverScript.pipelineId,
    body: serverScript.body,
    language: 'groovy',
    createdOn: new Date(serverScript.created),
    updatedOn: new Date(serverScript.updated),
    updatedBy: serverScript.updatedBy
  };
}

function toPublishedPipeline(serverPipeline: any): PublishedPipeline {
  return {
    pipelineId: serverPipeline.pipelineId,
    version: serverPipeline.version,
    userScripts: (serverPipeline.userScripts || []).map(toPipelineScript),
    publishedOn: new Date(serverPipeline.published),
    publishedBy: serverPipeline.publishedBy
  };
}

function toPipelineTest(serverTest: any): PipelineTest {
  return {
    id: serverTest.id,
    pipelineId: serverTest.pipelineId,
    name: serverTest.name,
    input: serverTest.input,
    output: serverTest.output,
    createdOn: new Date(serverTest.created),
    updatedOn: new Date(serverTest.updated),
    updatedBy: serverTest.updatedBy
  };
}

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  constructor(private dataService: DataService) {}

  getPipelines(): Observable<Pipeline[]> {
    return this.dataService.get(ResourceRoute);
  }

  getPipeline(pipelineId: number): Observable<Pipeline> {
    return this.dataService.get(`${ResourceRoute}/${pipelineId}`);
  }

  getPipelineScripts(pipelineId: number): Observable<PipelineScript[]> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/scripts`)
      .pipe(map(serverScripts => serverScripts.map(toPipelineScript)));
  }

  getPipelineScript(
    pipelineId: number,
    scriptId: number
  ): Observable<PipelineScript> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/scripts/${scriptId || -1}`)
      .pipe(map(toPipelineScript));
  }

  createPipelineScript(script: PipelineScript): Observable<PipelineScript> {
    return this.dataService
      .post(`${ResourceRoute}/${script.pipelineId}/scripts`, script)
      .pipe(map(toPipelineScript));
  }

  updatePipelineScript(script: PipelineScript): Observable<PipelineScript> {
    return this.dataService
      .put(`${ResourceRoute}/${script.pipelineId}/scripts`, script)
      .pipe(map(toPipelineScript));
  }

  getPipelineTests(pipelineId: number): Observable<PipelineTest[]> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/tests`)
      .pipe(map(serverScripts => serverScripts.map(toPipelineTest)));
  }

  getPipelineTest(
    pipelineId: number,
    testId: number
  ): Observable<PipelineTest> {
    return this.dataService
      .get(`${ResourceRoute}/${pipelineId}/tests/${testId}`)
      .pipe(map(toPipelineTest));
  }

  createPipelineTest(test: PipelineTest): Observable<PipelineTest> {
    return this.dataService
      .post(`${ResourceRoute}/${test.pipelineId}/tests`, test)
      .pipe(map(toPipelineTest));
  }

  updatePipelineTest(test: PipelineTest): Observable<PipelineTest> {
    return this.dataService
      .put(`${ResourceRoute}/${test.pipelineId}/tests`, test)
      .pipe(map(toPipelineTest));
  }

  deletePipelineTest(test: PipelineTest): Observable<void> {
    return this.dataService.delete(
      `${ResourceRoute}/${test.pipelineId}/tests/${test.id}`
    );
  }

  runPipelineTests(pipelineId: number): Observable<PipelineTestRun[]> {
    return this.dataService.post(`${ResourceRoute}/${pipelineId}/test`, '');
  }

  runPipelineTest(
    pipelineId: number,
    testId: number
  ): Observable<PipelineTestRun> {
    return this.dataService.post(`${ResourceRoute}/${pipelineId}/test`, '', {
      params: {
        testId
      }
    });
  }

  compilePipelineScript(scriptBody: string): Observable<ScriptError[]> {
    return this.dataService.post(`${ResourceRoute}/compile`, scriptBody);
  }

  publishPipeline(pipelineId: number): Observable<PublishedPipeline> {
    return this.dataService.post(`${ResourceRoute}/${pipelineId}/publish`, '');
  }

  activatePipeline(pipeline: Pipeline): Observable<String> {
    return this.dataService.put(`${ResourceRoute}`, pipeline);
  }

  getPublishedPipelines(pipelineCode: string): Observable<PublishedPipeline[]> {
    return this.dataService
      .get(PublishedPipelinesRoute, {
        params: {
          pipelineCode
        }
      })
      .pipe(map(serverPipelines => serverPipelines.map(toPublishedPipeline)));
  }

  getPublishedPipeline(
    pipelineCode: string,
    version: number
  ): Observable<PublishedPipeline> {
    return this.dataService
      .get(PublishedPipelinesRoute, {
        params: {
          pipelineCode,
          version
        }
      })
      .pipe(
        map(serverPipelines => serverPipelines.map(toPublishedPipeline)[0])
      );
  }
}
