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

  getCutPoints(request: GradeYearSearch): Observable<AssessmentGradeYearCutPoints> {
    return this.dataService.get(`${AggregateServiceRoute}/assessmentCutPoints`, {
      params: <any>request
    }).pipe(
      map(response => response.map(serverPoints => <AssessmentGradeYearCutPoints>{
        gradeYear: {
          grade: serverPoints.gradeYear.gradeCode,
          year: serverPoints.gradeYear.schoolYear
        },
        cutPoints: serverPoints.cutPoints
      }))
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
