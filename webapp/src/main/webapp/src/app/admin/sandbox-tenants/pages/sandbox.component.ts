import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { SandboxService } from '../service/sandbox.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { DeleteSandboxConfigurationModalComponent } from '../modal/delete-sandbox.modal';
import { ArchiveSandboxConfigurationModalComponent } from '../modal/archive-sandbox.modal';
import { ResetDataModalComponent } from '../modal/reset-data.modal';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';
import { SandboxStore } from '../store/sandbox.store';

@Component({
  selector: 'sandbox-config',
  templateUrl: './sandbox.component.html'
})
export class SandboxConfigurationComponent implements OnInit {
  sandboxes: SandboxConfiguration[];
  localizationDefaults: any;

  private _modalSubscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: SandboxService,
    private store: SandboxStore,
    private translationLoader: RdwTranslateLoader,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getSandboxes();
    this.getTranslations();
  }

  openDeleteSandboxModal(sandbox: SandboxConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      DeleteSandboxConfigurationModalComponent
    );
    let modal: DeleteSandboxConfigurationModalComponent =
      modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.deleted.subscribe(() => {
        this.store.setState(
          this.store.state.filter(({ code }) => code !== sandbox.code)
        );
      })
    );
  }

  openArchiveSandboxModal(sandbox: SandboxConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      ArchiveSandboxConfigurationModalComponent
    );
    let modal: ArchiveSandboxConfigurationModalComponent =
      modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.archived.subscribe(sandbox => {
        console.log(sandbox);
      })
    );
  }

  openResetDataModal(sandbox: SandboxConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      ResetDataModalComponent
    );
    let modal: ResetDataModalComponent = modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.resetData.subscribe(sandbox => {
        console.log(sandbox);
      })
    );
  }

  getTranslations() {
    this.translationLoader
      //TODO: Get the correct language code from somewhere, do not hardcode
      .getFlattenedTranslations('en')
      .subscribe(translations => (this.localizationDefaults = translations));
  }

  unsubscribe() {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }

  private getSandboxes(): void {
    this.service.getAll().subscribe(sandboxes => {
      this.store.setState(sandboxes);
    });

    this.store.getState().subscribe(sandboxes => (this.sandboxes = sandboxes));
  }
}
