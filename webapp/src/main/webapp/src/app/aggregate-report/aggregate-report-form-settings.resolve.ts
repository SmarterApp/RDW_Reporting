import { Injectable } from "@angular/core";
import { AggregateReportService } from "./aggregate-report.service";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportRequest } from "../report/aggregate-report-request";
import { AggregateReportOptionsMapper } from "./aggregate-report-options.mapper";
import { AggregateReportRequestMapper } from "./aggregate-report-request.mapper";
import { AggregateReportOptions } from "./aggregate-report-options";
import { TranslateService } from "@ngx-translate/core";

/**
 * This resolver is responsible for fetching an aggregate report based upon
 * an optional report id query parameter.
 */
@Injectable()
export class AggregateReportFormSettingsResolve implements Resolve<AggregateReportFormSettings> {

  constructor(private service: AggregateReportService,
              private optionMapper: AggregateReportOptionsMapper,
              private requestMapper: AggregateReportRequestMapper,
              private translate: TranslateService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AggregateReportFormSettings> {
    const options: AggregateReportOptions = route.parent.data[ 'options' ];
    const reportId: string = route.queryParamMap.get('src');
    if (reportId) {
      return this.service.getReportById(Number.parseInt(reportId))
        .flatMap(report => this.requestMapper.toSettings(<AggregateReportRequest>report.request, options))
        .map(settings => Object.assign(settings, {
          name: AggregateReportFormSettingsResolve.incrementFileNameSuffix(settings.name)
        }));
    }
    return Observable.of(this.optionMapper.toDefaultSettings(options));
  }

  /**
   * Given the name "My Name" this method will return "My Name (1)"
   * Given the name "My Name (1)" this method will return "My Name (2)"
   *
   * @param {string} name the name with an optional "(N)" to increment
   * @returns {string} the given name suffixed with "(N + 1)" or " (1)" if no "(N)" is provided
   */
  static incrementFileNameSuffix(name: string): string {
    return name.replace(/((\((\d+)\)(\s)?)?$)/, (a) => {
      if (a == '') {
        return ` (${Number(a.replace(/[()]/g, '')) + 1})`;
      }
      return `(${Number(a.replace(/[()]/g, '')) + 1})`;
    });
  }
}

