import { Injectable } from "@angular/core";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { AssessmentDetails } from "../model/assessment-details.model";
import { Observable } from "rxjs/Observable";

/**
 * This service is responsible for providing details for a given assessment type including:
 * - performance levels
 * - rollup level
 *
 * Currently values can be hard-coded, but this service may need to make server-side calls
 * to support configurable subjects/non-SBAC assessments.
 * This service should be used rather than any isICA/isSummative/isMath, etc tests.
 */
@Injectable()
export class AssessmentDetailsService {
  private static IabDetails: AssessmentDetails = {
    performanceLevels: 3,
    performanceGroupingCutpoint: 3
  };

  private static IcaSummativeDetails: AssessmentDetails = {
    performanceLevels: 4,
    performanceGroupingCutpoint: 3
  };

  /**
   * Retrieve the details for the given assessment type.
   *
   * @param {AssessmentType} assessmentType An assessment type
   * @returns {Observable<AssessmentDetails>} The assessment details
   */
  public getDetails(assessmentType: AssessmentType): Observable<AssessmentDetails> {
    return Observable.of(assessmentType == AssessmentType.IAB
      ? AssessmentDetailsService.IabDetails
      : AssessmentDetailsService.IcaSummativeDetails);
  }

}
