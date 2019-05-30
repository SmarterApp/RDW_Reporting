import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { SandboxService } from '../service/sandbox.service';
import { SandboxConfiguration } from '../model/sandbox-configuration';
import { NotificationService } from '../../../shared/notification/notification.service';

@Component({
  selector: 'delete-sandbox-modal',
  templateUrl: './delete-sandbox.modal.html'
})
export class DeleteSandboxConfigurationModalComponent implements OnDestroy {
  sandbox: SandboxConfiguration;
  deleted: EventEmitter<SandboxConfiguration> = new EventEmitter();

  constructor(
    public modal: BsModalRef,
    private service: SandboxService,
    private notificationService: NotificationService
  ) {}

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.service.delete(this.sandbox.code).subscribe(
      () => {
        this.deleted.emit(this.sandbox);
        this.notificationService.success({
          id: 'sandbox-config.delete-modal.success'
        });
        this.modal.hide();
      },
      error => {
        this.notificationService.error({ id: 'sandbox-config.errors.delete' });
        this.modal.hide();
      }
    );
  }

  ngOnDestroy(): void {
    this.deleted.complete();
  }
}
