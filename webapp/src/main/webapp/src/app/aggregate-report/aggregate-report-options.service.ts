import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { CachingDataService } from "../shared/data/caching-data.service";

const ServiceRoute = '/aggregate-service';

// Used to hotfix natural order of completeness and strict booleans not being in "affirmative-first" order
const IdDescending = (a, b) => b.id - a.id;

// IDs are no longer used by the UI
const codesOf = values => values.map(value => value.code);

/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`).map(options => <AggregateReportOptions>{
      assessmentGrades: codesOf(options.assessmentGrades),
      assessmentTypes: codesOf(options.assessmentTypes),
      completenesses: codesOf(options.completenesses.sort(IdDescending)),
      dimensionTypes: options.dimensionTypes,
      economicDisadvantages: codesOf(options.economicDisadvantages.sort(IdDescending)),
      ethnicities: codesOf(options.ethnicities),
      genders: codesOf(options.genders),
      individualEducationPlans: codesOf(options.individualEducationPlans.sort(IdDescending)),
      interimAdministrationConditions: codesOf(options.interimAdministrationConditions),
      limitedEnglishProficiencies: codesOf(options.limitedEnglishProficiencies.sort(IdDescending)),
      migrantStatuses: codesOf(options.migrantStatuses.sort(IdDescending)),
      section504s: codesOf(options.section504s.sort(IdDescending)),
      schoolYears: options.schoolYears,
      statewideReporter: options.statewideReporter,
      subjects: codesOf(options.subjects),
      summativeAdministrationConditions: codesOf(options.summativeAdministrationConditions)
    });
  }

}
