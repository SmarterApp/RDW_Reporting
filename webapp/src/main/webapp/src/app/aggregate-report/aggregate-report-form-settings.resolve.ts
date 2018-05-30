import { Injectable } from '@angular/core';
import { AggregateReportService } from './aggregate-report.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { AggregateReportRequest } from '../report/aggregate-report-request';
import { AggregateReportOptionsMapper } from './aggregate-report-options.mapper';
import { AggregateReportRequestMapper } from './aggregate-report-request.mapper';
import { AggregateReportOptions } from './aggregate-report-options';
import { Utils } from '../shared/support/support';
import { map } from 'rxjs/operators';

/**
 * This resolver is responsible for fetching an aggregate report based upon
 * an optional report id query parameter.
 */
@Injectable()
export class AggregateReportFormSettingsResolve implements Resolve<AggregateReportFormSettings> {

  constructor(private service: AggregateReportService,
              private optionMapper: AggregateReportOptionsMapper,
              private requestMapper: AggregateReportRequestMapper) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AggregateReportFormSettings> {
    const options: AggregateReportOptions = route.parent.data[ 'options' ];
    const reportId: string = route.queryParamMap.get('src');
    if (reportId) {
      return this.service.getReportById(Number.parseInt(reportId))
        .flatMap(report => this.requestMapper.toSettings(<AggregateReportRequest>report.request, options))
        .pipe(
          map(settings => Object.assign(settings, {
            name: Utils.appendOrIncrementFileNameSuffix(settings.name)
          }))
        );
    }

    return this.optionMapper.toDefaultSettings(options);
  }

}

