import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AggregateReportOptions } from './aggregate-report-options';
import { CachingDataService } from '../shared/data/caching-data.service';
import { OrganizationMapper } from '../shared/organization/organization.mapper';
import { map } from 'rxjs/operators';
import { AggregateServiceRoute } from '../shared/service-route';
import { AssessmentTypeOrdering, BooleanOrdering, CompletenessOrdering } from '../shared/ordering/orderings';

const ServiceRoute = AggregateServiceRoute;
const assessmentTypeComparator = AssessmentTypeOrdering.compare;
const booleanComparator = BooleanOrdering.compare;
const completenessComparator = CompletenessOrdering.compare;

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
          assessmentGrades: options.assessmentGrades.reverse(),
          assessmentTypes: options.assessmentTypes.sort(assessmentTypeComparator),
          completenesses: options.completenesses.sort(completenessComparator),
          defaultOrganization: options.defaultOrganization
            ? this.organizationMapper.map(options.defaultOrganization)
            : undefined,
          dimensionTypes: options.dimensionTypes,
          interimAdministrationConditions: options.interimAdministrationConditions,
          queryTypes: [ 'Basic', 'FilteredSubgroup' ],
          reportTypes: [ 'GeneralPopulation', 'LongitudinalCohort' ],
          schoolYears: options.schoolYears,
          statewideReporter: options.statewideReporter,
          subjects: options.subjects,
          summativeAdministrationConditions: options.summativeAdministrationConditions,
          studentFilters: {
            economicDisadvantages: options.economicDisadvantages.sort(booleanComparator),
            ethnicities: options.ethnicities,
            genders: options.genders,
            individualEducationPlans: options.individualEducationPlans.sort(booleanComparator),
            limitedEnglishProficiencies: options.limitedEnglishProficiencies.sort(booleanComparator),
            englishLanguageAcquisitionStatuses: options.englishLanguageAcquisitionStatuses,
            migrantStatuses: options.migrantStatuses.sort(booleanComparator),
            section504s: options.section504s.sort(booleanComparator)
          }
        })
      );
  }

}
