import { Injectable } from '@angular/core';
import { DataService } from '../../shared/data/data.service';
import { AggregateServiceRoute } from '../../shared/service-route';
import { map } from 'rxjs/operators';
import { GradeYear } from '../grade-year';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AssessmentService {

  constructor(private dataService: DataService) {
  }

  getCutPointsBySubject(request: GradeYearSearch): Observable<Map<string, AssessmentGradeYearCutPoints>> {
    return this.dataService.get(`${AggregateServiceRoute}/assessmentCutPoints`, {
      params: <any>request
    }).pipe(
      map((response: ServerAssessmentGradeYearCutPoints[]) => {
        const pointsBySubject = new Map();
        response.forEach((serverPoints: ServerAssessmentGradeYearCutPoints) => {
          const gradeYearPoints = {
            gradeYear: {
              grade: serverPoints.gradeYear.gradeCode,
              year: serverPoints.gradeYear.schoolYear
            },
            cutPoints: serverPoints.cutPoints
          };

          const points = pointsBySubject.get(serverPoints.subjectCode);
          if (points != null) {
            points.push(gradeYearPoints);
          } else {
            pointsBySubject.set(serverPoints.subjectCode, [ gradeYearPoints ]);
          }
        });
        return pointsBySubject;
      })
    );
  }

}

export interface GradeYearSearch {
  readonly gradeCodes: string[];
  readonly toSchoolYear: number;
}

export interface AssessmentGradeYearCutPoints {
  readonly gradeYear: GradeYear;
  readonly cutPoints: number[];
}

interface ServerGradeYear {
  readonly gradeCode: string;
  readonly schoolYear: number;
}

interface ServerAssessmentGradeYearCutPoints {
  readonly gradeYear: ServerGradeYear;
  readonly subjectCode: string;
  readonly cutPoints: number[];
}
