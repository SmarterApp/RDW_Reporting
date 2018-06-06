import { Injectable } from '@angular/core';
import { AssessmentDefinition } from './assessment-definition';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';
import { AggregateReportType } from "../aggregate-report-form-settings";

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
  aggregateReportTypes: [ AggregateReportType.GeneralPopulation ]
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
  aggregateReportTypes: [ AggregateReportType.Claim ]
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
  aggregateReportTypes: [ AggregateReportType.Claim, AggregateReportType.LongitudinalCohort ]
};

const ClaimIca: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [ 1, 2, 3 ],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: ClaimIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: [ AggregateReportType.Claim ]
};

const ClaimSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [ 1, 2, 3 ],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: ClaimIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: true,
  aggregateReportTypes: [ AggregateReportType.Claim, AggregateReportType.LongitudinalCohort ]
};

const TargetSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: ['claim', 'target', 'dimension'],
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: [ AggregateReportType.Target ]
};

export const GeneralPopulationIabKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'iab',
  reportType: AggregateReportType.GeneralPopulation
};

export const GeneralPopulationIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'ica',
  reportType: AggregateReportType.GeneralPopulation
};

export const ClaimIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'ica',
  reportType: AggregateReportType.Claim
};

export const GeneralPopulationSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: AggregateReportType.GeneralPopulation
};
export const LongitudinalCohortSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: AggregateReportType.LongitudinalCohort
};

export const ClaimSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: AggregateReportType.Claim
};

export const TargetSummativeKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: AggregateReportType.Target
};

export const definitions = [
  { key: GeneralPopulationIabKey, value: Iab },
  { key: GeneralPopulationIcaKey, value: Ica },
  { key: ClaimIcaKey, value: ClaimIca },
  { key: GeneralPopulationSumKey, value: Summative },
  { key: LongitudinalCohortSumKey, value: Summative },
  { key: ClaimSumKey, value: ClaimSummative },
  { key: TargetSummativeKey, value: TargetSummative }
  ];

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
  get(assessmentType: string, reportType: AggregateReportType): AssessmentDefinition {
    return definitions.find((value) => assessmentType === value.key.assessmentType && reportType === value.key.reportType).value;
  }
}

export interface DefinitionKey {
  readonly assessmentType: string;
  readonly reportType: AggregateReportType;
}
