import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AggregateReportOptions,
  AltScore,
  Claim,
  Subject
} from './aggregate-report-options';
import { CachingDataService } from '../shared/data/caching-data.service';
import { OrganizationMapper } from '../shared/organization/organization.mapper';
import { map } from 'rxjs/operators';
import { AggregateServiceRoute } from '../shared/service-route';
import {
  AssessmentTypeOrdering,
  BooleanOrdering,
  CompletenessOrdering
} from '../shared/ordering/orderings';
import { ReportQueryType } from '../report/report';
import { Filter } from '../exam/model/filter';
import { StudentFieldType } from '../app-settings';

const ServiceRoute = AggregateServiceRoute;
const assessmentTypeComparator = AssessmentTypeOrdering.compare;
const booleanComparator = BooleanOrdering.compare;
const completenessComparator = CompletenessOrdering.compare;

function toSubject(serverSubject: any): Subject {
  return serverSubject;
}

function toClaim(serverClaim: any): Claim {
  return {
    assessmentType: serverClaim.assessmentTypeCode,
    subject: serverClaim.subjectCode,
    code: serverClaim.code
  };
}

function toAltScore(serverAltScore: any): AltScore {
  return {
    assessmentType: serverAltScore.assessmentTypeCode,
    subject: serverAltScore.subjectCode,
    code: serverAltScore.code
  };
}

// NOTE: Disabled student fields result in an empty array being returned
function select(filters: Filter[], studentField: StudentFieldType): string[] {
  const filter = filters.find(({ id }) => id === studentField);
  return filter != null ? filter.values.slice() : [];
}

/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {
  constructor(
    private dataService: CachingDataService,
    private organizationMapper: OrganizationMapper
  ) {}

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`).pipe(
      map(serverOptions => ({
        assessmentGrades: serverOptions.assessmentGrades.slice(),
        assessmentTypes: serverOptions.assessmentTypes
          .slice()
          .sort(assessmentTypeComparator),
        claims: serverOptions.claims.map(toClaim),
        altScores: serverOptions.altScores.map(toAltScore),
        completenesses: serverOptions.completenesses
          .slice()
          .sort(completenessComparator),
        defaultOrganization: serverOptions.defaultOrganization
          ? this.organizationMapper.map(serverOptions.defaultOrganization)
          : undefined,
        dimensionTypes: serverOptions.dimensionTypes.slice(),
        interimAdministrationConditions: serverOptions.interimAdministrationConditions.slice(),
        queryTypes: ['Basic', 'FilteredSubgroup'],
        reportTypes: serverOptions.assessmentTypes.some(x => x === 'sum')
          ? <ReportQueryType[]>[
              'CustomAggregate',
              'Longitudinal',
              'Claim',
              'AltScore',
              'Target'
            ]
          : <ReportQueryType[]>['CustomAggregate', 'Claim'],
        schoolYears: serverOptions.schoolYears.slice(),
        statewideReporter: serverOptions.statewideReporter,
        subjects: serverOptions.subjects.map(toSubject),
        summativeAdministrationConditions: serverOptions.summativeAdministrationConditions.slice(),
        studentFilters: {
          economicDisadvantages: select(
            serverOptions.studentFilters,
            'EconomicDisadvantage'
          ).sort(booleanComparator),
          ethnicities: select(serverOptions.studentFilters, 'Ethnicity'),
          genders: select(serverOptions.studentFilters, 'Gender'),
          individualEducationPlans: select(
            serverOptions.studentFilters,
            'IndividualEducationPlan'
          ).sort(booleanComparator),
          limitedEnglishProficiencies: select(
            serverOptions.studentFilters,
            'LimitedEnglishProficiency'
          ).sort(booleanComparator),
          englishLanguageAcquisitionStatuses: select(
            serverOptions.studentFilters,
            'EnglishLanguageAcquisitionStatus'
          ).sort(booleanComparator),
          migrantStatuses: select(
            serverOptions.studentFilters,
            'MigrantStatus'
          ).sort(booleanComparator),
          section504s: select(serverOptions.studentFilters, 'Section504').sort(
            booleanComparator
          ),
          languages: select(serverOptions.studentFilters, 'PrimaryLanguage'),
          militaryConnectedCodes: select(
            serverOptions.studentFilters,
            'MilitaryStudentIdentifier'
          )
        }
      }))
    );
  }
}
