import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { TenantConfiguration } from '../model/tenant-configuration';
import { TenantService } from '../service/tenant.service';
import { DeleteTenantConfigurationModalComponent } from '../modal/delete-tenant.modal';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { TenantStore } from '../store/tenant.store';

@Component({
  selector: 'tenant-config',
  templateUrl: './tenant.component.html'
})
export class TenantConfigurationComponent implements OnInit {
  tenants: TenantConfiguration[];
  localizationDefaults: any;
  private _modalSubscriptions: Subscription[] = [];

  constructor(
    private translationLoader: RdwTranslateLoader,
    private route: ActivatedRoute,
    private service: TenantService,
    private store: TenantStore,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getTenants();
    this.getTranslations();
  }

  getTranslations() {
    this.translationLoader
      // TODO: Get the correct language code from somewhere, do not hardcode
      .getFlattenedTranslations('en')
      .subscribe(translations => (this.localizationDefaults = translations));
  }

  getTenants(): void {
    this.service.getAll().subscribe(tenants => {
      this.store.setState(tenants);
      // this.tenants = tenants
    });

    this.store.getState().subscribe(tenants => (this.tenants = tenants));
  }

  openDeleteTenantModal(tenant: TenantConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      DeleteTenantConfigurationModalComponent
    );
    let modal: DeleteTenantConfigurationModalComponent = modalReference.content;
    modal.tenant = tenant;
    this._modalSubscriptions.push(
      modal.deleted.subscribe(() => {
        this.store.setState(
          this.store.state.filter(({ code }) => code !== tenant.code)
        );
      })
    );
  }

  unsubscribe() {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }
}
