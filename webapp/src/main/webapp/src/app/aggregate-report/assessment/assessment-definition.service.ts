import { Injectable } from "@angular/core";
import { AssessmentDefinition } from "./assessment-definition";
import { Observable } from "rxjs/Observable";

const Iab: AssessmentDefinition = {
  typeCode: 'iab',
  interim: true,
  performanceLevels: [1, 2, 3],
  performanceLevelCount: 3,
  performanceLevelGroupingCutPoint: 3
};

const Ica: AssessmentDefinition = {
  typeCode: 'ica',
  interim: true,
  performanceLevels: [1, 2, 3, 4],
  performanceLevelCount: 4,
  performanceLevelGroupingCutPoint: 3
};

const Summative: AssessmentDefinition = {
  typeCode: 'sum',
  interim: false,
  performanceLevels: [1, 2, 3, 4],
  performanceLevelCount: 4,
  performanceLevelGroupingCutPoint: 3
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
    return Observable.of(new Map([
      [ 'ica', Ica ],
      [ 'iab', Iab ],
      [ 'sum', Summative ]
    ]))
  }

}
