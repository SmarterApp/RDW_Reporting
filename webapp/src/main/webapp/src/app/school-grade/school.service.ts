import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Grade } from "./grade.model";
import { ResponseUtils } from "../shared/response-utils";
import { DataService } from "../shared/data/data.service";
import { Utils } from "../shared/support/support";
import { catchError, map } from 'rxjs/operators';

const ServiceRoute = '/reporting-service';

/**
 * This service is responsible for retrieving schools.
 */
@Injectable()
export class SchoolService {

  constructor(private dataService: DataService) {
  }

  /**
   * Given a school, find the grades with visible assessments.
   *
   * @param schoolId                The school's entity ID
   * @returns {Observable<number>}  Observable of the grades with visible assessments
   */
  findGradesWithAssessmentsForSchool(schoolId: number): Observable<Grade[]> {
    return this.dataService
      .get(`${ServiceRoute}/schools/${schoolId}/assessmentGrades`)
      .pipe(
        catchError(ResponseUtils.badResponseToNull),
        map(apiGrades => this.mapGradesFromApi(apiGrades))
      );
  }

  private mapGradesFromApi(serverGrades: any[]): Grade[] {
    return serverGrades
      .filter(serverGrade => this.isValidGrade(serverGrade))
      .map(serverGrade => this.mapGradeFromApi(serverGrade));
  }

  private isValidGrade(serverGrade: any): boolean {
    return !Utils.isNullOrUndefined(serverGrade)
      && !Utils.isNullOrUndefined(serverGrade.code);
  }

  private mapGradeFromApi(serverGrade: any): Grade {
    const grade = new Grade();
    grade.id = serverGrade.id;
    grade.code = serverGrade.code;
    return grade;
  }

}
