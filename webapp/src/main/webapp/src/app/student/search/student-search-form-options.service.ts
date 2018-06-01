import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StudentSearchFormOptions } from './student-search-form-options';
import { GroupService } from '../../groups/group.service';
import { OrganizationService } from '../../shared/organization/organization.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';

@Injectable()
export class StudentSearchFormOptionsService {

  constructor(private organizationService: OrganizationService,
              private groupService: GroupService) {
  }

  getOptions(): Observable<StudentSearchFormOptions> {
    return forkJoin(
      this.organizationService.getSchools(),
      this.groupService.getGroups()
    ).pipe(
      map(([schools, groups]) => <StudentSearchFormOptions>{
        schools: schools,
        groups: groups
      })
    );
  }

}
