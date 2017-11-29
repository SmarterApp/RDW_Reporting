import { Injectable } from "@angular/core";
import { DataService, Utils } from "@sbac/rdw-reporting-common-ngx";
import { Observable } from "rxjs/Observable";
import { Grade } from "./grade.model";
import { ResponseUtils } from "../shared/response-utils";

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
      .get(`/schools/${schoolId}/assessmentGrades`)
      .catch(ResponseUtils.badResponseToNull)
      .map(apiGrades => this.mapGradesFromApi(apiGrades));
  }

  private mapGradesFromApi(apiGrades: any[]): Grade[] {
    return apiGrades
      .filter(apiGrade => this.isValidGrade(apiGrade))
      .map(apiGrade => this.mapGradeFromApi(apiGrade));
  }

  private isValidGrade(apiModel: any): boolean {
    return !Utils.isNullOrUndefined(apiModel)
      && !Utils.isNullOrUndefined(apiModel.code);
  }

  private mapGradeFromApi(apiModel: any): Grade {
    let uiModel = new Grade();
    uiModel.id = apiModel.id;
    uiModel.code = apiModel.code;
    return uiModel;
  }

}
