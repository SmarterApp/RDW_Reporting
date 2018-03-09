import { Injectable } from '@angular/core';
import { CachingDataService } from '../shared/data/caching-data.service';
import { ReportingServiceRoute } from '../shared/service-route';
import { map } from 'rxjs/operators';
import { Group } from '../user/model/group.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GroupService {

  constructor(private dataService: CachingDataService) {
  }

  getGroups(): Observable<Group[]> {
    return this.dataService.get(`${ReportingServiceRoute}/groups`).pipe(
      map(serverGroups => serverGroups.map(serverGroup => {
        // TODO make Group an interface
        const group: Group = new Group();
        group.id = serverGroup.id;
        group.name = serverGroup.name;
        group.schoolName = serverGroup.schoolName;
        group.schoolId = serverGroup.schoolId;
        group.subjectCode = serverGroup.subjectCode;
        return group;
      }))
    )
  }

}
