import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../shared/service-route';
import { map } from 'rxjs/operators';
import { UserGroup, UserGroupRequest } from './user-group';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../shared/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../shared/support/support';
import { Student } from '../student/search/student';

@Injectable()
export class UserGroupService {

  constructor(private dataService: DataService,
              private translate: TranslateService) {
  }

  getGroups(): Observable<UserGroup[]> {
    return this.dataService.get(`${ReportingServiceRoute}/userGroups`).pipe(
      map(serverGroups => serverGroups.map(serverGroup => this.toUserGroup(serverGroup)))
    );
  }

  getGroup(groupId: number): Observable<UserGroup> {
    return this.dataService.get(`${ReportingServiceRoute}/userGroups/${groupId}`).pipe(
      map(serverGroup => this.toUserGroup(serverGroup))
    );
  }

  saveGroup(group: UserGroup): Observable<UserGroup> {
    if (group.id == null) {
      return this.createGroup(group);
    }
    return this.updateGroup(group).pipe(map(() => group));
  }

  deleteGroup(group: UserGroup): Observable<void> {
    return this.dataService.delete(`${ReportingServiceRoute}/userGroups/${group.id}`);
  }

  private createGroup(group: UserGroup): Observable<UserGroup> {
    if (Utils.isNullOrEmpty(group.name)) {
      group = Object.assign(group, {
        name: `this.translate.instant('user-group.default-name') ${Date.now()}`
      });
    }
    return this.dataService.post(`${ReportingServiceRoute}/userGroups`, this.toUserGroupRequest(group)).pipe(
      map(serverGroup => this.toUserGroup(serverGroup))
    );
  }

  private updateGroup(group: UserGroup): Observable<UserGroup> {
    return this.dataService.put(`${ReportingServiceRoute}/userGroups`, this.toUserGroupRequest(group));
  }

  private toUserGroupRequest(group: UserGroup): UserGroupRequest {
    return {
      id: group.id,
      name: group.name,
      subjectCodes: group.subjects,
      studentIds: group.students.map(student => student.id)
    };
  }

  private toUserGroup(serverGroup: any): UserGroup {
    return {
      id: serverGroup.id,
      name: serverGroup.name,
      // TODO need to saturate empty subject filter with all subjects
      subjects: serverGroup.subjectCodes,
      students: serverGroup.students != null
        ? serverGroup.students.map(serverStudent => this.toStudent(serverStudent))
        : []
    };
  }

  private toStudent(serverStudent: any): Student {
    return {
      id: serverStudent.id,
      ssid: serverStudent.ssid,
      firstName: serverStudent.firstName,
      lastName: serverStudent.lastName,
      gender: serverStudent.genderCode,
      ethnicities: serverStudent.ethnicityCodes,
      englishLanguageAcquisitionStatus: serverStudent.englishLanguageAcquisitionStatusCode,
      individualEducationPlan: serverStudent.individualEducationPlan,
      limitedEnglishProficiency: serverStudent.limitedEnglishProficiency,
      section504: serverStudent.section504,
      migrantStatus: serverStudent.migrantStatus
    };
  }

}
