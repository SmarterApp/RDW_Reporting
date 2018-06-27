import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SubjectDefinition } from './subject';
import { CachingDataService } from '../shared/data/caching-data.service';
import { ReportingServiceRoute } from '../shared/service-route';
import { ResponseUtils } from '../shared/response-utils';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Assessment } from '../assessments/model/assessment.model';
import { range } from '../shared/support/support';

const ServiceRoute = ReportingServiceRoute;

const MathScorableClaims = [ '1', 'SOCK_2', '3' ];
const ELAScorableClaims = [ 'SOCK_R', '2-W', 'SOCK_LS', '4-CR' ];
const ScorableClaimsBySubject: Map<string, string[]> = new Map([
  [ 'Math', MathScorableClaims ],
  [ 'ELA', ELAScorableClaims ]
]);
const MathOrganizationalClaims = [ '1', '2', '3', '4' ];
const ELAOrganizationalClaims = [ '1-LT', '1-IT', '2-W', '3-L', '3-S', '4-CR' ];
const OrganizationalClaimsBySubject: Map<string, string[]> = new Map([
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
   * Retrieve the definition for the given assessment's subject and type
   *
   * @param {string} assessment The assessment to get the definition for
   * @returns {Observable<SubjectDefinition>} The definition
   */
  getSubjectDefinitionForAssessment(assessment: Assessment): Observable<SubjectDefinition> {
    return this.getSubjectDefinition(assessment.subject, assessment.type);
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

  private mapDefinition(serverDefinition: any): SubjectDefinition {
    return <SubjectDefinition>{
      subject: serverDefinition.subjectCode,
      assessmentType: serverDefinition.asmtTypeCode,
      performanceLevels: range(1, serverDefinition.performanceLevelCount),
      performanceLevelCount: serverDefinition.performanceLevelCount,
      performanceLevelStandardCutoff: serverDefinition.performanceLevelStandardCutoff,
      scorableClaims: serverDefinition.scorableClaims,
      scorableClaimPerformanceLevels: range(1, serverDefinition.claimScorePerformanceLevelCount),
      scorableClaimPerformanceLevelCount: serverDefinition.claimScorePerformanceLevelCount
    };
  }

  getOrganizationalClaimsBySubject(): Observable<Map<string, string[]>> {
    return of(OrganizationalClaimsBySubject);
  }

}
