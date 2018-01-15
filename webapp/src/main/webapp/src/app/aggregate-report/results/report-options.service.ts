import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data/data.service";
import { QueryBuilderModel } from "../model/query-builder.model";
import { ResponseUtils } from "../../shared/response-utils";
import { Observable } from "rxjs/Observable";

const ServiceRoute = '/aggregate-service/reportOptions';

@Injectable()
export class ReportOptionsService {

  private _compareFn = (a, b) => {
    return a && b ? a.localeCompare(b) : 0;
  };

  constructor(private dataService: DataService) {
  }

  get(): Observable<any> {
    return this.dataService.get(`${ServiceRoute}`)
      .catch(ResponseUtils.badResponseToNull)
      .map(x => {
        if (x == null) {
          return x;
        }
        return this.mapFromApi(x);
      });
  }

  private mapFromApi(apiModel): QueryBuilderModel {
    let uiModel: QueryBuilderModel = new QueryBuilderModel();

    uiModel.schoolYears = apiModel.schoolYears.sort((a, b) => b - a);

    uiModel.assessmentTypes = [];
    apiModel.assessmentTypes.forEach(assessmentType => uiModel.assessmentTypes.push(assessmentType.code));
    uiModel.assessmentTypes.sort(this._compareFn);

    uiModel.ethnicities = [];
    apiModel.ethnicities.forEach(ethnicity => uiModel.ethnicities.push(ethnicity.code));
    uiModel.ethnicities = uiModel.ethnicities.sort(this._compareFn);

    uiModel.genders = [];
    apiModel.genders.forEach(gender => uiModel.genders.push(gender.code));
    uiModel.genders = uiModel.genders.sort((a, b) => a && b ? b.localeCompare(a) : 0);

    uiModel.grades = [];
    apiModel.grades.forEach(grade => uiModel.grades.push(grade.code));
    uiModel.grades = uiModel.grades.sort(this._compareFn);

    uiModel.subjects = [];
    apiModel.subjects.forEach(subject => uiModel.subjects.push(subject.code));
    return uiModel;
  }
}
