import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AggregateReportOptions } from './aggregate-report-options';
import { CachingDataService } from '../shared/data/caching-data.service';
import { OrganizationMapper } from '../shared/organization/organization.mapper';
import { map } from 'rxjs/operators';
import { AggregateServiceRoute } from '../shared/service-route';
import {
  AssessmentTypeOrdering,
  BooleanOrdering,
  ClaimCodeOrdering,
  CompletenessOrdering,
  SubjectOrdering
} from '../shared/ordering/orderings';
import { join } from '@kourge/ordering/comparator';

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
    return this.dataService.get(`${ServiceRoute}/reportOptions`).pipe(
      map(serverOptions => <AggregateReportOptions>{
        assessmentGrades: serverOptions.assessmentGrades.concat(),
        assessmentTypes: serverOptions.assessmentTypes.concat().sort(assessmentTypeComparator),
        claims: this.mapClaims(serverOptions.claims.concat()).sort(join(
          SubjectOrdering.on((claim: Claim) => claim.subject).compare,
          ClaimCodeOrdering.on((claim: Claim) => claim.code).compare)),
        completenesses: serverOptions.completenesses.concat().sort(completenessComparator),
        defaultOrganization: serverOptions.defaultOrganization
          ? this.organizationMapper.map(serverOptions.defaultOrganization)
          : undefined,
        dimensionTypes: serverOptions.dimensionTypes.concat(),
        interimAdministrationConditions: serverOptions.interimAdministrationConditions.concat(),
        queryTypes: [ 'Basic', 'FilteredSubgroup' ],
        reportTypes: [ 'GeneralPopulation', 'Claim', 'LongitudinalCohort' ],
        schoolYears: serverOptions.schoolYears.concat(),
        statewideReporter: serverOptions.statewideReporter,
        subjects: serverOptions.subjects.concat(),
        summativeAdministrationConditions: serverOptions.summativeAdministrationConditions.concat(),
        studentFilters: {
          economicDisadvantages: serverOptions.economicDisadvantages.concat().sort(booleanComparator),
          ethnicities: serverOptions.ethnicities.concat(),
          genders: serverOptions.genders.concat(),
          individualEducationPlans: serverOptions.individualEducationPlans.concat().sort(booleanComparator),
          limitedEnglishProficiencies: serverOptions.limitedEnglishProficiencies.concat().sort(booleanComparator),
          englishLanguageAcquisitionStatuses: serverOptions.englishLanguageAcquisitionStatuses.concat(),
          migrantStatuses: serverOptions.migrantStatuses.concat().sort(booleanComparator),
          section504s: serverOptions.section504s.concat().sort(booleanComparator)
        }
      })
    );
  }

  mapClaims(claims: any[]): Claim[] {
    return claims.map(claim => <Claim>{
      assessmentType: claim.assessmentTypeCode,
      subject: claim.subjectCode,
      code: claim.code
    });
  }

}

export interface Claim {
  readonly assessmentType: string;
  readonly subject: string;
  readonly code: string;
}
