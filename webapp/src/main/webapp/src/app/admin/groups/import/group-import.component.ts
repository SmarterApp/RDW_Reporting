import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GroupImportService } from './group-import.service';
import { ImportResult } from './import-result.model';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../shared/support/support';
import { AdminServiceRoute } from '../../../shared/service-route';

const URL = '/api' + AdminServiceRoute + '/studentGroups';

@Component({
  selector: 'admin',
  templateUrl: 'group-import.component.html'
})
export class GroupImportComponent implements OnInit {
  @ViewChild('fileDialog')
  fileDialog: ElementRef;

  importResults: ImportResult[] = [];
  public uploader: FileUploader;
  public hasDropZoneOver: boolean;

  constructor(
    private studentGroupService: GroupImportService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.uploader = new FileUploader({ url: URL });
    this.uploader.setOptions({ autoUpload: true });

    this.uploader.onCompleteItem = (
      item: FileItem,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) => {
      if (status == 202 && !Utils.isNullOrUndefined(response)) {
        this.importResults.push(
          this.studentGroupService.mapImportResultFromApi(JSON.parse(response))
        );
        this.importResults = this.importResults.slice();
      }
    };

    this.uploader.onErrorItem = (
      item: FileItem,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) => {
      this.importResults.push(
        this.studentGroupService.mapImportResultFromApi({
          message: this.translate.instant('group-import.upload-failed'),
          filename: item.file.name,
          status: 'FAILED'
        })
      );
      this.importResults = this.importResults.slice();
    };

    this.uploader.onCompleteAll = () => {
      this.uploader.clearQueue();
    };

    window.onbeforeunload = this.confirmNavigation.bind(this);
  }

  confirmNavigation(event) {
    if (this.uploader.isUploading) {
      let dialogText = this.translate.instant(
        'group-import.upload-in-progress'
      );
      event.returnValue = dialogText;
      return dialogText;
    }
  }

  openFileDialog() {
    this.fileDialog.nativeElement.click();
  }
}
