import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { CachingDataService } from "../shared/data/caching-data.service";

const ServiceRoute = '/aggregate-service';

/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`)
      .map(options => <AggregateReportOptions>{
        assessmentGrades: options.assessmentGrades,
        assessmentTypes: options.assessmentTypes,
        ethnicities: options.ethnicities,
        genders: options.genders,
        schoolYears: options.schoolYears,
        subjects: options.subjects,

        // The goal is to make these data driven and to include policy information in the admin condition
        // (e.g. appliesToAssessmentType: ['iab', 'ica'] or appliesToInterim: true)
        interimAdministrationConditions: [
          {id: 2, code: 'SD'},
          {id: 3, code: 'NS'}
        ],
        summativeAdministrationConditions: [
          {id: 1, code: 'Valid'},
          {id: 4, code: 'IN'}
        ],
        completenesses: [
          {id: 2, code: 'Complete'},
          {id: 1, code: 'Partial'}
        ],

        // These may be data-driven later and contain undefined (not-specified) as a value
        migrantStatuses: [true, false],
        ieps: [true, false],
        plan504s: [true, false],
        limitedEnglishProficiencies: [true, false],
        economicDisadvantages: [true, false],

        dimensionTypes: options.dimensionTypes,

        statewideReporter: options.statewideReporter
      });
  }

}
