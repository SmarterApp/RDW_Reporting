import { Injectable } from "@angular/core";
import { AssessmentDefinition } from "./assessment-definition";
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { IdentityColumnOptions } from '../results/aggregate-report-table.component';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';

const Iab: AssessmentDefinition = {
  typeCode: 'iab',
  interim: true,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelDisplayTypes: [ PerformanceLevelDisplayTypes.Separate ],
  aggregateReportIdentityColumns: IdentityColumnOptions.concat(),
  aggregateReportStateResultsEnabled: false
};

const Ica: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [1, 2, 3, 4],
  performanceLevelCount: 4,
  performanceLevelDisplayTypes: PerformanceLevelDisplayTypes.values(),
  performanceLevelGroupingCutPoint: 3,
  aggregateReportIdentityColumns: IdentityColumnOptions
    .filter(option => option !== 'assessmentLabel'),
  aggregateReportStateResultsEnabled: false
};

const Summative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3, 4],
  performanceLevelCount: 4,
  performanceLevelDisplayTypes: PerformanceLevelDisplayTypes.values(),
  performanceLevelGroupingCutPoint: 3,
  aggregateReportIdentityColumns: IdentityColumnOptions
    .filter(option => option !== 'assessmentLabel'),
  aggregateReportStateResultsEnabled: true
};

/**
 * Responsible for providing assessment type related properties
 */
@Injectable()
export class AssessmentDefinitionService {

  /**
   * TODO make this hit backend and cache results.
   * TODO expand to consider subject type possibly.
   *
   * Gets all assessment type related data.
   *
   * @returns {Observable<Map<string, AssessmentDefinition>>}
   */
  public getDefinitionsByAssessmentTypeCode(): Observable<Map<string, AssessmentDefinition>> {
    return of(new Map([
      [ 'ica', Ica ],
      [ 'iab', Iab ],
      [ 'sum', Summative ]
    ]));
  }

}
