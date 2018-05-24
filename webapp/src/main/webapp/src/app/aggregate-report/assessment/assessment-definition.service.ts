import { Injectable } from '@angular/core';
import { AssessmentDefinition } from './assessment-definition';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';

export const IdentityColumnOptions: string[] = [
  'organization',
  'assessmentGrade',
  'assessmentLabel',
  'schoolYear',
  'dimension',
];

const Iab: AssessmentDefinition = {
  typeCode: 'iab',
  interim: true,
  performanceLevels: [ 1, 2, 3 ],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: IdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: [ 'GeneralPopulation' ]
};

const Ica: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [ 1, 2, 3, 4 ],
  performanceLevelCount: 4,
  performanceLevelDisplayTypes: PerformanceLevelDisplayTypes.values(),
  performanceLevelGroupingCutPoint: 3,
  aggregateReportIdentityColumns: IdentityColumnOptions
    .filter(option => option !== 'assessmentLabel'),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: [ 'Claim' ]
};

const Summative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [ 1, 2, 3, 4 ],
  performanceLevelCount: 4,
  performanceLevelDisplayTypes: PerformanceLevelDisplayTypes.values(),
  performanceLevelGroupingCutPoint: 3,
  aggregateReportIdentityColumns: IdentityColumnOptions
    .filter(option => option !== 'assessmentLabel'),
  aggregateReportStateResultsEnabled: true,
  aggregateReportTypes: [ 'Claim', 'LongitudinalCohort' ]
};

const ClaimIca: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [ 1, 2, 3 ],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: IdentityColumnOptions
    .filter(option => option !== 'assessmentLabel'),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: [ 'Claim' ]
}

const ClaimSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [ 1, 2, 3 ],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: IdentityColumnOptions
    .filter(option => option !== 'assessmentLabel'),
  aggregateReportStateResultsEnabled: true,
  aggregateReportTypes: [ 'Claim', 'LongitudinalCohort' ]
}

/**
 * Responsible for providing assessment type related properties
 */
@Injectable()
export class AssessmentDefinitionService {

  /**
   * TODO make this hit backend and cache results.
   * TODO expand to consider subject type possibly.
   *
   * Gets definition key related data.
   *
   * @returns {Observable<Map<DefinitionKey, AssessmentDefinition>>}
   */
  public getDefinitionsByDefinitionKey(): Observable<Map<DefinitionKey, AssessmentDefinition>> {
    return of(
      new Map([
        [ <DefinitionKey>{ assessmentType: 'iab', reportType: 'GeneralPopulation' }, Iab ],
        [ <DefinitionKey>{ assessmentType: 'ica', reportType: 'GeneralPopulation' }, Ica ],
        [ <DefinitionKey>{ assessmentType: 'ica', reportType: 'Claim' }, ClaimIca ],
        [ <DefinitionKey>{ assessmentType: 'sum', reportType: 'GeneralPopulation' }, Summative ],
        [ <DefinitionKey>{ assessmentType: 'sum', reportType: 'LongitudinalCohort' }, Summative ],
        [ <DefinitionKey>{ assessmentType: 'sum', reportType: 'Claim' }, ClaimSummative ]
      ])
    );
  }

}

export interface DefinitionKey {
  readonly assessmentType: string;
  readonly reportType: string;
}
