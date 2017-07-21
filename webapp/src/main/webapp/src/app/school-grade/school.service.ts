import { Injectable } from "@angular/core";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs";
import { School } from "../user/model/school.model";
import { isNullOrUndefined } from "util";
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
   * @param school                  A school
   * @returns {Observable<number>}  Observable of the grades with visible assessments
   */
  findGradesWithAssessmentsForSchool(school: School): Observable<Grade[]> {
    return this.dataService
      .get(`/schools/${school.id}/assessmentGrades`)
      .catch(ResponseUtils.notFoundToEmptyArray)
      .map((apiGrades) => this.mapGradesFromApi(apiGrades));
  }
  private mapGradesFromApi(apiGrades: any[]): Grade[] {
    return apiGrades
      .filter(apiGrade => !isNullOrUndefined(apiGrade) && !isNullOrUndefined(apiGrade.code))
      .map(apiGrade => this.mapGradeFromApi(apiGrade));
  }

  private mapGradeFromApi(apiModel: any): Grade {
    let uiModel = new Grade();

    uiModel.id = apiModel.id;
    uiModel.code = apiModel.code;

    return uiModel;
  }
}
