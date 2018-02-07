import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { CachingDataService } from "../shared/data/caching-data.service";

const ServiceRoute = '/aggregate-service';

// Used to hotfix natural order of completeness and strict booleans not being in "affirmative-first" order
const IdDescending = (a, b) => b.id - a.id;

/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`).map(options => <AggregateReportOptions>{
      assessmentGrades: options.assessmentGrades,
      assessmentTypes: options.assessmentTypes,
      completenesses: options.completenesses.sort(IdDescending),
      dimensionTypes: options.dimensionTypes,
      economicDisadvantages: options.economicDisadvantages.sort(IdDescending),
      ethnicities: options.ethnicities,
      genders: options.genders,
      individualEducationPlans: options.individualEducationPlans.sort(IdDescending),
      interimAdministrationConditions: options.interimAdministrationConditions,
      limitedEnglishProficiencies: options.limitedEnglishProficiencies.sort(IdDescending),
      migrantStatuses: options.migrantStatuses.sort(IdDescending),
      section504s: options.section504s.sort(IdDescending),
      schoolYears: options.schoolYears,
      statewideReporter: options.statewideReporter,
      subjects: options.subjects,
      summativeAdministrationConditions: options.summativeAdministrationConditions
    });
  }

}
