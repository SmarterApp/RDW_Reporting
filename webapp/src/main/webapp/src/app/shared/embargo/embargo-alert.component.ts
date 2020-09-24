import { ReportingEmbargoService } from './reporting-embargo.service';
import { AggregateEmbargoService } from './aggregate-embargo.service';
import { UserService } from '../security/service/user.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class EmbargoAlert {
  show$: Observable<boolean>;

  constructor(
    private service: ReportingEmbargoService | AggregateEmbargoService,
    private userSevice: UserService
  ) {
    this.show$ = forkJoin(
      null, // service.isEmbargoed(),
      userSevice
        .getUser()
        .pipe(map(({ permissions }) => permissions.includes('EMBARGO_READ')))
    ).pipe(map(([embargoed, hasEmbargoRead]) => embargoed && hasEmbargoRead));
  }
}
