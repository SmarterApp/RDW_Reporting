import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { FileUploader } from 'ng2-file-upload';
import { IsrTemplate } from './model/isr-template';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplateDeleteModal } from './isr-template-delete.modal';
import { UserService } from '../../shared/security/service/user.service';
import { map } from 'rxjs/operators';
import { IsrTemplateSandboxModal } from './isr-template-sandbox.modal';
import { AdminServiceRoute } from '../../shared/service-route';

const URL = '/api' + AdminServiceRoute + '/templates';
const AllowedMimeTypes = ['text/html'];

class Column {
  id: string; // en.json name
  field: string; // isr-template field
  sortField: string;
  sortable: boolean;

  constructor({ id, field = '', sortField = '', sortable = true }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : field;
    this.sortable = sortable;
  }
}
@Component({
  selector: 'isr-template',
  templateUrl: './isr-template.component.html'
})
export class IsrTemplateComponent implements OnInit {
  columns: Column[] = [
    new Column({ id: 'subject', sortField: 'subjectSort' }),
    new Column({
      id: 'assessment-type',
      field: 'assessmentType',
      sortField: 'assessmentTypeSort'
    }),
    new Column({ id: 'status', sortField: 'uploadedDate' })
  ];

  isrTemplates: IsrTemplate[];
  visible = true;
  initialized = false;

  // below determine which if any alert need to be displayed
  successfulDelete: boolean;
  unableToUpload: boolean;
  errorKey: string;
  isSandbox: boolean;

  // Set to true if user has permission to upload or delete templates respectively
  canUpload: boolean;
  canDelete: boolean;

  fileUploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'template',
    allowedFileType: ['html'],
    allowedMimeType: AllowedMimeTypes
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private isrTemplateService: IsrTemplateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.unableToUpload = false;
    this.errorKey = null;
    this.userService.getUser().subscribe(user => {
      this.isSandbox = user.sandboxUser;

      // Both upload and delete enabled by ISR Write permissions.
      this.canUpload = user.permissions.includes('ISR_TEMPLATE_WRITE');
      this.canDelete = user.permissions.includes('ISR_TEMPLATE_WRITE');
    });

    this.isrTemplateService.getIsrTemplates().subscribe(isrTemplates => {
      this.isrTemplates = isrTemplates;
      this.initialized = true;
    });
  }

  getStatus(rowData: IsrTemplate) {
    return rowData.uploadedDate == null
      ? 'notConfiguredTemplate'
      : 'configuredTemplate';
  }

  showIcons(rowData) {
    return rowData.uploadedDate !== null;
  }

  clearErrors() {
    this.unableToUpload = false;
    this.errorKey = null;
  }

  openDeleteTemplateModal(rowData: IsrTemplate) {
    if (this.isSandbox) {
      this.openForSandboxModal('delete');
    } else {
      const modalReference: BsModalRef = this.modalService.show(
        IsrTemplateDeleteModal,
        {}
      );
      const modal: IsrTemplateDeleteModal = modalReference.content;
      modal.isrTemplate = rowData;
      modal.deleteTemplateEvent.subscribe(res => {
        this.successfulDelete = res.data;
        if (this.successfulDelete) {
          this.reloadData();
        }
      });
    }
  }

  openForSandboxModal(action: string) {
    const modalReference: BsModalRef = this.modalService.show(
      IsrTemplateSandboxModal,
      {}
    );
    const modal: IsrTemplateSandboxModal = modalReference.content;
    modal.sandboxUploadMessage = action !== 'delete';
  }

  /**
   * Upload selected file to be the new report template for the selected row's subject and assessment type.
   * @param event the event containing the file selection
   * @param rowData data about the selelcted row.
   */
  onFileSelected(event: EventEmitter<File[]>, rowData: IsrTemplate) {
    const file: File = event[0];
    if (!AllowedMimeTypes.includes(file.type)) {
      this.unableToUpload = true;
      this.errorKey = 'isr-template.bad-file-type';
      return;
    }

    this.isrTemplateService
      .uploadTemplateFile(
        file,
        rowData.templateName,
        rowData.subject.value,
        rowData.assessmentType.value
      )
      .subscribe(
        () => {
          this.unableToUpload = false;
          this.reloadData();
        },
        err => {
          this.unableToUpload = true;
        }
      );
  }

  private reloadData() {
    this.visible = false;
    this.isrTemplateService.getIsrTemplates().subscribe(isrTemplates => {
      this.isrTemplates = isrTemplates;
      setTimeout(() => (this.visible = true), 1000);
    });
  }

  /**
   * Downloads the reference template.
   */
  downloadReferenceTemplate() {
    this.isrTemplateService.getTemplateFile();
  }

  /**
   * Downloads report templeate for the selected row's subject and assessment type.
   * @param rowData data from the selected row.
   */
  downloadReportTemplate(rowData: IsrTemplate): void {
    this.isrTemplateService.downloadTemplateFile(
      rowData.subject.value,
      rowData.assessmentType.value
    );
  }

  getDownloadLabel(rowData: IsrTemplate): string {
    return (
      `${this.translateService.instant('isr-template.label-aria-download')}` +
      this.getTemplateMessage(rowData)
    );
  }

  getUploadLabel(rowData: IsrTemplate): string {
    return (
      `${this.translateService.instant('isr-template.label-aria-upload')}` +
      this.getTemplateMessage(rowData)
    );
  }

  getDeletedLabel(rowData: IsrTemplate): string {
    return (
      `${this.translateService.instant('isr-template.label-aria-delete')}` +
      this.getTemplateMessage(rowData)
    );
  }

  getTemplateMessage(rowData: IsrTemplate): string {
    return (
      `${this.translateService.instant(rowData.subject.label)}` +
      ` ${this.translateService.instant(rowData.assessmentType.label)}` +
      ` ${this.translateService.instant('isr-template.label-aria-template')}`
    );
  }
}
