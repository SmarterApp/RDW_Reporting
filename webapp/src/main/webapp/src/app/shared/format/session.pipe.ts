import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../support/support';

@Pipe({ name: 'session' })
export class SessionPipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(session: string): string {
    if (Utils.isNullOrEmpty(session)) {
      return this.translate.instant("assessment-results.session-unknown");
    }

    return session;
  }
}

