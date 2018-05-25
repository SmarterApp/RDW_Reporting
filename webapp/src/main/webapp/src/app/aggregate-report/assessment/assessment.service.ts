import { Injectable } from '@angular/core';
import { DataService } from '../../shared/data/data.service';
import { Assessment } from './assessment';
import { Observable } from 'rxjs/Observable';
import { AggregateServiceRoute } from '../../shared/service-route';
import { map } from 'rxjs/operators';

/**
 * Represents an assessment search
 */
export interface AssessmentQuery {
  readonly ids: number[];
}

/**
 * Responsible for getting assessment information from the olap data server
 */
@Injectable()
export class AssessmentService {

  constructor(private dataService: DataService) {
  }

  /**
   * Gets assessments matching the request search criteria
   *
   * @param {AssessmentQuery} query
   * @returns {Observable<Assessment[]>}
   */
  getAssessments(query: AssessmentQuery): Observable<Assessment[]> {
    return this.dataService.get(`${AggregateServiceRoute}/assessments`, {
      params: <any>query
    }).pipe(
      map(serverAssessments => serverAssessments.map(serverAssessment => <Assessment>{
        id: serverAssessment.id,
        name: serverAssessment.name,
        label: serverAssessment.label,
        type: serverAssessment.typeCode,
        subject: serverAssessment.subjectCode,
        grade: serverAssessment.gradeCode,
        gradeSequence: serverAssessment.gradeSequence,
        schoolYear: serverAssessment.schoolYear,
        cutPoints: serverAssessment.cutPoints.filter(point => point != null)
      }))
    );
  }

}

