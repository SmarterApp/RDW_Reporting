import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { Observable } from "rxjs";
import { School } from "./model/school.model";
import { Injectable } from "@angular/core";
import { ordering } from "@kourge/ordering";
import { byNumber, byString } from "@kourge/ordering/comparator";
import { GroupQuery } from "./model/group-query.model";
import { URLSearchParams } from "@angular/http";
import { Group } from "./model/group.model";
import { ResponseUtils } from "../shared/response-utils";
import { Resolution } from "../shared/resolution.model";

const ALL = 'ALL';

@Injectable()
export class GroupService {

  constructor(private dataService: DataService) {
  }

  getFilterOptions(): Observable<Resolution<GroupFilterOptions>> {
    return this.dataService
      .get('/groups/filters')
      .map(this.mapFilterOptionsFromApi.bind(this))
      .catch(ResponseUtils.throwError);
  }

  getGroups(query: GroupQuery): Observable<Group[]> {
    return this.dataService
      .get('/groups', { search: this.mapQueryToParams(query) })
      .map(groups => groups.map(this.mapGroupFromApi));
  }

  delete(group: Group): Observable<any> {
    return this.dataService.delete(`/groups/${group.id}`);
  }

  private mapQueryToParams(query: GroupQuery) {
    let params = new URLSearchParams();

    let subjects = query.subject == ALL
      ? query.availableSubjects
      : [ query.subject ];

    for (let subject of subjects.filter(x => x != ALL)) {
      params.append('subject', subject);
    }
    params.set('schoolId', query.school.id.toString());
    params.set('schoolYear', query.schoolYear.toString());
    return params;
  }

  private mapGroupFromApi(apiModel): Group {
    let uiModel = new Group();
    uiModel.id = apiModel.id;
    uiModel.schoolYear = apiModel.schoolYear;
    uiModel.name = apiModel.name;
    uiModel.schoolName = apiModel.schoolName;
    uiModel.subject = apiModel.subjectCode;
    uiModel.studentCount = apiModel.studentCount;
    uiModel.isDeleted = apiModel.deleted;
    return uiModel;
  }

  private mapFilterOptionsFromApi(apiModel): GroupFilterOptions {
    let uiModel = new GroupFilterOptions();

    uiModel.schools = (apiModel.schools && apiModel.schools.map(apiSchool => {
      let uiSchool = new School();
      uiSchool.id = apiSchool.id;
      uiSchool.name = apiSchool.name;
      uiSchool.naturalId = apiSchool.naturalId;
      return uiSchool;
    })) || [];

    uiModel.schoolYears = apiModel.schoolYears || [];
    uiModel.subjects = (apiModel.subjects && apiModel.subjects.map(subject => subject.toUpperCase())) || [];

    return this.adaptFilterOptions(uiModel);
  }

  private adaptFilterOptions(filterOptions: GroupFilterOptions): GroupFilterOptions {
    if (filterOptions.schoolYears.length == 0) {
      filterOptions.schoolYears = [ new Date().getFullYear() ];
    }
    filterOptions.schools.sort(ordering(byString).on<School>(x => x.name).compare);
    filterOptions.schoolYears.sort(ordering(byNumber).reverse().compare);
    filterOptions.subjects.splice(0, 0, ALL);
    return filterOptions;
  }
}
