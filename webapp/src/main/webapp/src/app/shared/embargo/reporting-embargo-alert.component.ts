import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ReportingEmbargoService } from './reporting-embargo.service';
import { UserService } from '../security/service/user.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'reporting-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
// tslint:disable-next-line:component-class-suffix
export class ReportingEmbargoAlert implements OnInit, OnChanges {
  @Input()
  year: number = null;

  @Input()
  districtId: number = null;

  show$: Observable<boolean>;

  constructor(
    private service: ReportingEmbargoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.updateShow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateShow();
  }

  private updateShow() {
    if (this.year && this.districtId) {
      this.show$ = forkJoin(
        this.service.getEmbargo(this.year, this.districtId),
        this.userService
          .getUser()
          .pipe(map(({ permissions }) => this.checkPermissions(permissions)))
      ).pipe(
        map(([embargoed, hasTestDataRead]) => embargoed && hasTestDataRead)
      );
    }
  }

  private checkPermissions(permissions: string[]): boolean {
    return (
      permissions.includes('TEST_DATA_REVIEWING_READ') ||
      permissions.includes('TEST_DATA_LOADING_READ')
    );
  }
}
