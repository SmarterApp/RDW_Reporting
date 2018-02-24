import { AggregateReportFormSettingsResolve } from "./aggregate-report-form-settings.resolve";
import { AggregateReportService } from "./aggregate-report.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AggregateReportRequestMapper } from "./aggregate-report-request.mapper";
import { AggregateReportOptionsMapper } from "./aggregate-report-options.mapper";
import { Observable } from "rxjs/Observable";
import Spy = jasmine.Spy;
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";

describe('AggregateReportFormSettingsResolve', () => {
  let reportService: AggregateReportService;
  let optionMapper: AggregateReportOptionsMapper;
  let requestMapper: AggregateReportRequestMapper;
  let translateService: TranslateService;
  let fixture: AggregateReportFormSettingsResolve;

  beforeEach(() => {
    reportService = jasmine.createSpyObj('AggregateReportService', [ 'getReportById' ]);
    optionMapper = jasmine.createSpyObj('AggregateReportOptionMapper', [ 'toDefaultSettings' ]);
    requestMapper = jasmine.createSpyObj('AggregateReportRequestMapper', [ 'toSettings' ]);
    translateService = jasmine.createSpyObj('TranslateService', [ 'instant' ]);
    fixture = new AggregateReportFormSettingsResolve(reportService, optionMapper, requestMapper, translateService);
  });

  it('should return request settings when report param is present. It should also add to the name.', () => {

    const reportId = 1;
    const defaultSettings: AggregateReportFormSettings = <any>{};
    const reportSettings: AggregateReportFormSettings = <any>{ name: 'A' };
    const report: any = {};
    (optionMapper.toDefaultSettings as Spy).and.callFake(() => defaultSettings);
    (reportService.getReportById as Spy).and.callFake(() => Observable.of(report));
    (requestMapper.toSettings as Spy).and.callFake(() => Observable.of(reportSettings));

    fixture.resolve(routeWithReport(reportId), <any>{}).subscribe(settings => {
      expect(settings).toEqual(<any>{
        name: 'A (1)'
      });
    });

    expect(reportService.getReportById as Spy).toHaveBeenCalledWith(reportId);
  });

  it('should return default settings when report param is absent', () => {

    const defaultSettings: any = {};
    (optionMapper.toDefaultSettings as Spy).and.callFake(() => defaultSettings);

    fixture.resolve(routeWithoutReport(), <any>{}).subscribe(settings => {
      expect(settings).toBe(defaultSettings);
    });

  });

  function routeWithReport(reportId: number): ActivatedRouteSnapshot {
    return <any>{
      parent: { data: {} },
      queryParamMap: new Map([ [ 'src', String(reportId) ] ])
    };
  }

  function routeWithoutReport(): ActivatedRouteSnapshot {
    return <any>{
      parent: { data: {} },
      queryParamMap: new Map([])
    };
  }

});
