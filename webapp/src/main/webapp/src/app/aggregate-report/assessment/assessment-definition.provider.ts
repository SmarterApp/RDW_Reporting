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
};

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
};

export const GeneralPopulationIabKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'iab',
  reportType: 'GeneralPopulation'
};

export const GeneralPopulationIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'iab',
  reportType: 'GeneralPopulation'
};

export const ClaimIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'ica',
  reportType: 'Claim'
};

export const GeneralPopulationSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'GeneralPopulation'
};
export const LongitudinalCohortSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'LongitudinalCohort'
};

export const ClaimSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'Claim'
};

/**
 * Responsible for providing definition key related properties
 */
@Injectable()
export class AssessmentDefinitionProvider {

  private definitions = new Map([
    [ GeneralPopulationIabKey, Iab ],
    [ GeneralPopulationIcaKey, Ica ],
    [ ClaimIcaKey, ClaimIca ],
    [ GeneralPopulationSumKey, Summative ],
    [ LongitudinalCohortSumKey, Summative ],
    [ ClaimSumKey, ClaimSummative ]
  ]);

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
      this.definitions
    );
  }

  /**
   * Gets the assessment definition by assessment type and report type
   * @param {string} assessmentType
   * @param {"LongitudinalCohort" | "GeneralPopulation" | "Claim"} reportType
   * @returns {AssessmentDefinition}
   */
  get(assessmentType: string, reportType: 'LongitudinalCohort' | 'GeneralPopulation' | 'Claim'): AssessmentDefinition {
    let assessmentDefinition = null;
    this.definitions.forEach((value: AssessmentDefinition, key: DefinitionKey) => {
        if (assessmentType === key.assessmentType && reportType === key.reportType) {
          assessmentDefinition = value;
        }
      }
    );
    return assessmentDefinition;
  }
}

export interface DefinitionKey {
  readonly assessmentType: string;
  readonly reportType: string;
}
