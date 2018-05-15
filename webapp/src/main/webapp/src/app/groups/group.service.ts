import { Injectable } from '@angular/core';
import { CachingDataService } from '../shared/data/caching-data.service';
import { ReportingServiceRoute } from '../shared/service-route';
import { map } from 'rxjs/operators';
import { Group } from '../groups/group';
import { Observable } from 'rxjs/Observable';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';

@Injectable()
export class GroupService {

  constructor(private dataService: CachingDataService) {
  }

  getGroups(): Observable<Group[]> {
    return this.dataService.get(`${ReportingServiceRoute}/groups`).pipe(
      map(serverGroups => serverGroups
        .sort(ordering(byString).on<any>(x => x.name).compare)
        .map(serverGroup => {
          return <Group>{
            id: serverGroup.id,
            name: serverGroup.name,
            schoolName: serverGroup.schoolName,
            schoolId: serverGroup.schoolId,
            subjectCode: serverGroup.subjectCode || 'ALL'
          };
      }))
    );
  }

  getGroup(groupId: number): Observable<Group> {
    return this.dataService.get(`${ReportingServiceRoute}/groups/${groupId}`).pipe(
      map(serverGroup => {
        return <Group>{
          id: serverGroup.id,
          name: serverGroup.name,
          schoolName: serverGroup.schoolName,
          schoolId: serverGroup.schoolId,
          subjectCode: serverGroup.subjectCode || 'ALL',
          totalStudents: serverGroup.studentCount
        };
      })
    );
  }

}
