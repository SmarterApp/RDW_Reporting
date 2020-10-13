import { Injectable } from '@angular/core';
import { AssessmentDefinition } from './assessment-definition';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';
import { ReportQueryType } from '../../report/report';

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

export const AltScoreIdentityColumnOptions: string[] = [
  'organization',
  'assessmentGrade',
  'schoolYear',
  'altScore',
  'dimension'
];

const Iab: AssessmentDefinition = {
  typeCode: 'iab',
  interim: true,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [PerformanceLevelDisplayTypes.Separate],
  aggregateReportIdentityColumns: IdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: ['CustomAggregate']
};

const Ica: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [1, 2, 3, 4],
  performanceLevelCount: 4,
  performanceLevelDisplayTypes: PerformanceLevelDisplayTypes.values(),
  performanceLevelGroupingCutPoint: 3,
  aggregateReportIdentityColumns: IdentityColumnOptions.filter(
    option => option !== 'assessmentLabel'
  ),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: ['Claim', 'AltScore']
};

const Summative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3, 4],
  performanceLevelCount: 4,
  performanceLevelDisplayTypes: PerformanceLevelDisplayTypes.values(),
  performanceLevelGroupingCutPoint: 3,
  aggregateReportIdentityColumns: IdentityColumnOptions.filter(
    option => option !== 'assessmentLabel'
  ),
  aggregateReportStateResultsEnabled: true,
  aggregateReportTypes: ['Claim', 'AltScore', 'Longitudinal']
};

const ClaimIca: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [PerformanceLevelDisplayTypes.Separate],
  aggregateReportIdentityColumns: ClaimIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: ['Claim']
};

const ClaimSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [PerformanceLevelDisplayTypes.Separate],
  aggregateReportIdentityColumns: ClaimIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: true,
  aggregateReportTypes: ['Claim', 'Longitudinal']
};

const AltScoreIca: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [PerformanceLevelDisplayTypes.Separate],
  aggregateReportIdentityColumns: AltScoreIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: ['AltScore']
};

const AltScoreSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [PerformanceLevelDisplayTypes.Separate],
  aggregateReportIdentityColumns: AltScoreIdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: true,
  aggregateReportTypes: ['AltScore']
};

const TargetSummative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [PerformanceLevelDisplayTypes.Separate],
  aggregateReportIdentityColumns: ['claim', 'target', 'dimension'],
  aggregateReportStateResultsEnabled: false,
  aggregateReportTypes: ['Target']
};

export const GeneralPopulationIabKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'iab',
  reportType: 'CustomAggregate'
};

export const GeneralPopulationIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'ica',
  reportType: 'CustomAggregate'
};

export const ClaimIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'ica',
  reportType: 'Claim'
};

export const AltScoreIcaKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'ica',
  reportType: 'AltScore'
};

export const GeneralPopulationSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'CustomAggregate'
};
export const LongitudinalCohortSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'Longitudinal'
};

export const ClaimSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'Claim'
};

export const AltScoreSumKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'AltScore'
};

export const TargetSummativeKey: DefinitionKey = <DefinitionKey>{
  assessmentType: 'sum',
  reportType: 'Target'
};

export const definitions = [
  { key: GeneralPopulationIabKey, value: Iab },
  { key: GeneralPopulationIcaKey, value: Ica },
  { key: ClaimIcaKey, value: ClaimIca },
  { key: AltScoreIcaKey, value: AltScoreIca },
  { key: GeneralPopulationSumKey, value: Summative },
  { key: LongitudinalCohortSumKey, value: Summative },
  { key: ClaimSumKey, value: ClaimSummative },
  { key: AltScoreSumKey, value: AltScoreSummative },
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
  // TODO:ConfigurableSubjects this needs to accept subject as a param
  get(
    assessmentType: string,
    reportType: ReportQueryType
  ): AssessmentDefinition {
    return definitions.find(
      value =>
        assessmentType === value.key.assessmentType &&
        reportType === value.key.reportType
    ).value;
  }
}

export interface DefinitionKey {
  readonly assessmentType: string;
  readonly reportType: ReportQueryType;
}
