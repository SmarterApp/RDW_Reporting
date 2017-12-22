import { CanDeactivate } from '@angular/router';
import { GroupImportComponent } from "./group-import.component";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class GroupImportDeactivateGuard implements CanDeactivate<GroupImportComponent> {

  canDeactivate(target: GroupImportComponent) {
    if(target.uploader.isUploading) {
      return window.confirm(this.translate.instant('messages.upload-in-progress'));
    }

    return true;
  }

  constructor(private translate: TranslateService){
  }
}
