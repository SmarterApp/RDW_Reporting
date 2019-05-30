import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { SandboxService } from '../service/sandbox.service';
import { SandboxConfiguration } from '../model/sandbox-configuration';
import { NotificationService } from '../../../shared/notification/notification.service';

@Component({
  selector: 'reset-data-modal',
  templateUrl: './reset-data.modal.html'
})
export class ResetDataModalComponent implements OnDestroy {
  sandbox: SandboxConfiguration;
  resetData: EventEmitter<SandboxConfiguration> = new EventEmitter();

  constructor(
    public modal: BsModalRef,
    private service: SandboxService,
    private notificationService: NotificationService
  ) {}

  cancel() {
    this.modal.hide();
  }

  reset() {
    this.service.resetData(this.sandbox.code).subscribe(
      () => {
        this.resetData.emit(this.sandbox);
        this.notificationService.success({
          id: 'sandbox-config.reset-modal.success'
        });
        this.modal.hide();
      },
      error => {
        this.notificationService.error({ id: 'sandbox-config.errors.reset' });
        this.modal.hide();
      }
    );
  }

  ngOnDestroy(): void {
    this.resetData.complete();
  }
}
