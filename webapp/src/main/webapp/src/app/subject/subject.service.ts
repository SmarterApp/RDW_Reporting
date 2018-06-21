import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SubjectDefinition } from './subject';
import { CachingDataService } from "../shared/data/caching-data.service";
import { ReportingServiceRoute } from "../shared/service-route";
import { ResponseUtils } from "../shared/response-utils";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs/observable/of";

const ServiceRoute = ReportingServiceRoute;

const MathScorableClaims = [ '1', 'SOCK_2', '3' ];
const ELAScorableClaims = [ 'SOCK_R', '2-W', 'SOCK_LS', '4-CR' ];
const ScorableClaimsBySubject: Map<string, string[]>  = new Map([
  [ 'Math', MathScorableClaims ],
  [ 'ELA', ELAScorableClaims ]
]);
const MathOrganizationalClaims = ['1', '2', '3', '4'];
const ELAOrganizationalClaims = ['1-LT', '1-IT', '2-W', '3-L', '3-S', '4-CR'];
const OrganizationalClaimsBySubject: Map<string, string[]>  = new Map([
  [ 'Math', MathOrganizationalClaims ],
  [ 'ELA', ELAOrganizationalClaims ]
]);

@Injectable()
export class SubjectService {

  constructor(private dataService: CachingDataService) {
  }

  /**
   * Retrieve all subjects available in the system.
   *
   * @returns {Observable<string[]>} The available subject codes
   */
  getSubjectCodes(): Observable<string[]> {
    return this.dataService
      .get(`${ServiceRoute}/subjects`)
      .pipe(
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Retrieve the definition for the given subject and assessment type
   *
   * @param {string} subject        A subject code
   * @param {string} assessmentType An assessment type code
   * @returns {Observable<SubjectDefinition>} The definition
   */
  getSubjectDefinition(subject: string, assessmentType: string): Observable<SubjectDefinition> {
    return this.getSubjectDefinitions()
      .pipe(
        map(definitions => definitions.find(definition =>
          definition.subject === subject &&
          definition.assessmentType === assessmentType))
      );
  }

  /**
   * Retrieve all definitions of a subject within the scope of an assessment type
   *
   * @returns {Observable<SubjectDefinition[]>} All definitions
   */
  getSubjectDefinitions(): Observable<SubjectDefinition[]> {
    return this.dataService
      .get(`${ServiceRoute}/subjects/definitions`)
      .pipe(
        map(definitions => definitions.map(this.mapDefinition)),
        catchError(ResponseUtils.throwError)
      );
  }

  private mapDefinition(apiDefinition: any): SubjectDefinition {
    return <SubjectDefinition>{
      subject: apiDefinition.subjectCode,
      assessmentType: apiDefinition.asmtTypeCode,
      performanceLevelCount: apiDefinition.performanceLevelCount,
      performanceLevelStandardCutoff: apiDefinition.performanceLevelStandardCutoff,
      scorableClaims: apiDefinition.scorableClaims,
      scorableClaimPerformanceLevelCount: apiDefinition.claimScorePerformanceLevelCount
    };
  }

  getScorableClaimsBySubject(): Observable<Map<string, string[]>> {
    return of(ScorableClaimsBySubject);
  }

  getOrganizationalClaimsBySubject(): Observable<Map<string, string[]>> {
    return of(OrganizationalClaimsBySubject);
  }

}
