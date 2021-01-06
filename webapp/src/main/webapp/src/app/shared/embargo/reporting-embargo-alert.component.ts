import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { ReportingEmbargoService } from './reporting-embargo.service';
import { School } from '../organization/organization';
import { Group } from '../../groups/group';
import { EmbargoAlert } from './EmbargoAlert';

@Component({
  selector: 'reporting-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
// tslint:disable-next-line:component-class-suffix
export class ReportingEmbargoAlert extends EmbargoAlert
  implements OnInit, OnChanges {
  constructor(private service: ReportingEmbargoService) {
    super();
  }

  @Input()
  year: number = null;

  @Input()
  school: School = null;

  @Input()
  group: Group = null;

  districtId: number = null;

  private static hasChanged(change: SimpleChange) {
    return (
      change &&
      change.currentValue &&
      change.currentValue !== change.previousValue
    );
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    let needsUpdate = false;

    if (ReportingEmbargoAlert.hasChanged(changes.year)) {
      this.year = changes.year.currentValue;
      needsUpdate = true;
    }
    if (ReportingEmbargoAlert.hasChanged(changes.school)) {
      this.school = changes.school.currentValue;
      this.districtId = this.school.districtId;
      needsUpdate = true;
    }
    if (ReportingEmbargoAlert.hasChanged(changes.group)) {
      this.group = changes.group.currentValue;
      this.districtId = this.group.districtId;
      needsUpdate = true;
    }
    if (needsUpdate) {
      this.updateShow();
    }
  }

  private updateShow() {
    if (this.year && this.districtId) {
      this.show$ = this.service.isEmbargoed(this.year, this.districtId).pipe();
    }
  }
}
