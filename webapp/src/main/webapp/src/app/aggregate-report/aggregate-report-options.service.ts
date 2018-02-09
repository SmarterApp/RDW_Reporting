import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { CachingDataService } from "../shared/data/caching-data.service";
import { ordering } from "@kourge/ordering";
import { ranking } from "@kourge/ordering/comparator";

const ServiceRoute = '/aggregate-service';

// Used to hotfix natural order of completeness and strict booleans not being in "affirmative-first" order
const booleanComparator = ordering(ranking([ 'yes', 'no', 'undefined' ])).compare;
const completenessComparator = ordering(ranking([ 'Partial', 'Complete' ])).compare;

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
      assessmentGrades: options.assessmentGrades,
      assessmentTypes: options.assessmentTypes,
      completenesses: options.completenesses.sort(completenessComparator),
      dimensionTypes: options.dimensionTypes,
      economicDisadvantages: options.economicDisadvantages.sort(booleanComparator),
      ethnicities: options.ethnicities,
      genders: options.genders,
      individualEducationPlans: options.individualEducationPlans.sort(booleanComparator),
      interimAdministrationConditions: options.interimAdministrationConditions,
      limitedEnglishProficiencies: options.limitedEnglishProficiencies.sort(booleanComparator),
      migrantStatuses: options.migrantStatuses.sort(booleanComparator),
      section504s: options.section504s.sort(booleanComparator),
      schoolYears: options.schoolYears,
      statewideReporter: options.statewideReporter,
      subjects: options.subjects,
      summativeAdministrationConditions: options.summativeAdministrationConditions
    });
  }

}
