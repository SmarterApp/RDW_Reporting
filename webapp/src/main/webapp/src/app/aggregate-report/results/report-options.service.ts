import { Injectable } from "@angular/core";
import { QueryBuilderModel } from "../model/query-builder.model";
import { ResponseUtils } from "../../shared/response-utils";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "../../shared/data/caching-data.service";

const ServiceRoute = '/aggregate-service';
const safeLocaleCompare = (a, b) => a && b ? a.localeCompare(b) : 0;
const safeReverseLocaleCompare = (a, b) => a && b ? b.localeCompare(a) : 0;

@Injectable()
export class ReportOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  get(): Observable<any> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`)
      .catch(ResponseUtils.badResponseToNull)
      .map(x => x == null ? null : this.mapFromApi(x));
  }

  private mapFromApi(remote): QueryBuilderModel {
    const local: QueryBuilderModel = new QueryBuilderModel();
    local.grades = remote.assessmentGrades.map(grade => grade.code).sort(safeLocaleCompare);
    local.assessmentTypes = remote.assessmentTypes.map(type => type.code).sort(safeLocaleCompare);
    local.ethnicities = remote.ethnicities.map(ethnicity => ethnicity.code).sort(safeLocaleCompare);
    local.genders = remote.genders.map(gender => gender.code).sort(safeReverseLocaleCompare);
    local.schoolYears = remote.schoolYears.sort((a, b) => b - a);
    local.subjects = remote.subjects.map(subject => subject.code);
    return local;
  }

}
