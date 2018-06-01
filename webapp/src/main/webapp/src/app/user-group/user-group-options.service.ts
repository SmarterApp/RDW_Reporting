import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserGroupOptions } from './user-group-options';
import { map } from 'rxjs/operators';
import { CachingDataService } from '../shared/data/caching-data.service';
import { ReportingServiceRoute } from '../shared/service-route';


@Injectable()
export class UserGroupOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  getOptions(): Observable<UserGroupOptions> {
    return this.dataService.get(`${ReportingServiceRoute}/examFilterOptions`).pipe(
      map(serverOptions => <UserGroupOptions>{
        subjects: serverOptions.subjects
      })
    );
  }

}
