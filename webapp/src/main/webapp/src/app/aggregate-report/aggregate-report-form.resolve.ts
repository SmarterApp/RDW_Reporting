import { Observable } from "rxjs/Observable";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";
import { AggregateReportForm } from "./aggregate-report-form";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class AggregateReportFormResolve implements Resolve<AggregateReportForm> {

  constructor(private service: AggregateReportOptionsService,
              private optionMapper: AggregateReportFormOptionsMapper) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AggregateReportForm> {
    return this.service.getReportOptions()
      .map(remoteOptions => {
        const options = this.optionMapper.map(remoteOptions);
        const settings = this.initializeFormSettings(options);
        return { options: options, settings: settings };
      });
  }

  /**
   * Creates the default/initial state of the aggregate report form based on the available options
   *
   * @param {AggregateReportFormOptions} options the options available for selection
   * @returns {AggregateReportFormSettings} the initial form state
   */
  private initializeFormSettings(options: AggregateReportFormOptions): AggregateReportFormSettings {
    const valuesOf = options => options.map(option => option.value);
    const firstValueOf = options => options[ 0 ].value;
    return <AggregateReportFormSettings>{
      assessmentGrades: [],
      assessmentType: firstValueOf(options.assessmentTypes),
      completenesses: [ firstValueOf(options.completenesses) ],
      ethnicities: valuesOf(options.ethnicities),
      genders: valuesOf(options.genders),
      interimAdministrationConditions: [ firstValueOf(options.interimAdministrationConditions) ],
      schoolYears: [ firstValueOf(options.schoolYears) ],
      subjects: valuesOf(options.subjects),
      summativeAdministrationConditions: [ firstValueOf(options.summativeAdministrationConditions) ],
      migrantStatuses: valuesOf(options.migrantStatuses),
      ieps: valuesOf(options.ieps),
      plan504s: valuesOf(options.plan504s),
      limitedEnglishProficiencies: valuesOf(options.limitedEnglishProficiencies),
      economicDisadvantages: valuesOf(options.economicDisadvantages),
      achievementLevelDisplayType: firstValueOf(options.achievementLevelDisplayTypes),
      valueDisplayType: firstValueOf(options.valueDisplayTypes),
      dimensionTypes: [],
      includeStateResults: true,
      includeAllDistricts: false,
      includeAllSchoolsOfSelectedDistricts: false,
      includeAllDistrictsOfSelectedSchools: true,
      districts: [],
      schools: []
    };
  }

}
