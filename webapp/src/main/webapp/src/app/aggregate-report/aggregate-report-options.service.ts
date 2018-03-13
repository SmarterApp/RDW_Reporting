import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { CachingDataService } from "../shared/data/caching-data.service";
import { ordering } from "@kourge/ordering";
import { ranking } from "@kourge/ordering/comparator";
import { OrganizationMapper } from "../shared/organization/organization.mapper";
import { map } from 'rxjs/operators';
import { AdminServiceRoute } from '../shared/service-route';

const ServiceRoute = AdminServiceRoute;

// Used to hotfix natural order of completeness and strict booleans not being in "affirmative-first" order
const booleanComparator = ordering(ranking([ 'yes', 'no', 'undefined' ])).compare;
const completenessComparator = ordering(ranking([ 'Complete', 'Partial' ])).compare;

/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {

  constructor(private dataService: CachingDataService,
              private organizationMapper: OrganizationMapper) {
  }

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`)
      .pipe(
        map(options => <AggregateReportOptions>{
          assessmentGrades: options.assessmentGrades,
          assessmentTypes: options.assessmentTypes,
          completenesses: options.completenesses.sort(completenessComparator),
          defaultOrganization: options.defaultOrganization
            ? this.organizationMapper.map(options.defaultOrganization)
            : undefined,
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
        })
      );
  }

}
