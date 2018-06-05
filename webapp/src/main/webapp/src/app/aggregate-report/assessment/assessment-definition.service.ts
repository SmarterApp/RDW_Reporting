import { Injectable } from '@angular/core';
import { AssessmentDefinition } from './assessment-definition';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';

export const IdentityColumnOptions: string[] = [
  'organization',
  'assessmentGrade',
  'assessmentLabel',
  'schoolYear',
  'dimension'
];

export const ClaimIdentityColumnOptions: string[] = [
  'organization',
  'assessmentGrade',
  'schoolYear',
  'claim',
  'dimension'
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
  aggregateReportIdentityColumns: ClaimIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: [ 'Claim' ]
};

const ClaimSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [ 1, 2, 3 ],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: ClaimIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: true,
  aggregateReportTypes: [ 'Claim', 'LongitudinalCohort' ]
};

const TargetSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: ['claim', 'target', 'dimension'],
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: [ 'Target' ]
};

export const GeneralPopulationIabKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'iab',
  reportType: 'GeneralPopulation'
};

export const GeneralPopulationIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'ica',
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

export const TargetSummativeKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'Target'
};

export const definitions = new Array(
  { key: GeneralPopulationIabKey, value: Iab },
  { key: GeneralPopulationIcaKey, value: Ica },
  { key: ClaimIcaKey, value: ClaimIca },
  { key: GeneralPopulationSumKey, value: Summative },
  { key: LongitudinalCohortSumKey, value: Summative },
  { key: ClaimSumKey, value: ClaimSummative },
  { key: TargetSummativeKey, value: TargetSummative }
);

/**
 * Responsible for providing definition key related properties
 */
@Injectable()
export class AssessmentDefinitionService {

  /**
   * Gets the assessment definition by assessment type and report type
   * @param {string} assessmentType
   * @param {string} reportType
   * @returns {AssessmentDefinition}
   */
  get(assessmentType: string, reportType: string): AssessmentDefinition {
    return definitions.find((value) => assessmentType === value.key.assessmentType && reportType === value.key.reportType).value;
  }
}

export interface DefinitionKey {
  readonly assessmentType: string;
  readonly reportType: string;
}
