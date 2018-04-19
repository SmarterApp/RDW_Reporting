import { Injectable } from "@angular/core";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";

@Injectable()
export class ExamFilterOptionsMapper {

  mapFromApi(serverOptions: any): ExamFilterOptions {
    const options: ExamFilterOptions = new ExamFilterOptions();
    options.schoolYears = serverOptions.schoolYears.concat();
    options.ethnicities = serverOptions.ethnicities.concat();
    options.genders = serverOptions.genders.concat();
    options.elasCodes = serverOptions.elasCodes.concat();
    options.subjects = serverOptions.subjects.concat();
    return options;
  }

}
