import { Injectable } from "@angular/core";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";

@Injectable()
export class ExamFilterOptionsMapper {
  mapFromApi(apiModel: any): ExamFilterOptions {
    let uiModel: ExamFilterOptions = new ExamFilterOptions();
    if (!apiModel) return uiModel;

    uiModel.schoolYears = [];
    apiModel.schoolYears.forEach(year => uiModel.schoolYears.push(year));

    uiModel.ethnicities = [];
    apiModel.ethnicities.forEach(ethnicity => uiModel.ethnicities.push(ethnicity));

    return uiModel;
  }
}
