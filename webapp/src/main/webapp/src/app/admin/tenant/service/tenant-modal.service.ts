import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/component/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { TenantConfiguration } from '../model/tenant-configuration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantModalService {
  constructor(
    private modalService: BsModalService,
    private translateService: TranslateService
  ) {}

  openDeleteConfirmationModal(tenant: TenantConfiguration): Observable<void> {
    const modalReference: BsModalRef = this.modalService.show(
      ConfirmationModalComponent
    );
    const modal: ConfirmationModalComponent = modalReference.content;

    modal.head = this.translateService.instant(
      'tenant.delete.modal.head',
      tenant
    );
    modal.body = this.translateService.instant(
      `tenant.delete.modal.body.${tenant.type}`,
      tenant
    );
    modal.acceptButton = this.translateService.instant('common.action.delete');
    modal.acceptButtonClass = 'btn-danger';
    modal.declineButton = this.translateService.instant('common.action.cancel');
    return modal.accept;
  }
}
