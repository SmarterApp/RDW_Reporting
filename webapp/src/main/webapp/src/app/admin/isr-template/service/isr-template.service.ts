import { Injectable } from '@angular/core';
import { TranslateDatePipe } from '../../../shared/i18n/translate-date.pipe';
import { IsrTemplate } from '../model/isr-template';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Download } from '../../../shared/data/download.model';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class IsrTemplateService {
  constructor(
    private datePipe: TranslateDatePipe,
    private http: Http,
    private translateService: TranslateService
  ) {}

  formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM d, y');
  }

  getNotConfigured(): string {
    return `${this.translateService.instant('isr-template.not-configured')}`;
  }

  getConfigured(date: Date): string {
    return (
      `${this.translateService.instant('isr-template.configured')}` +
      this.formatAsLocalDate(date)
    );
  }

  getTemplateReportName(subject: string, assessmentType: string): string {
    return (
      subject +
      '-' +
      assessmentType +
      `${this.translateService.instant('isr-template.template-name')}`
    );
  }

  delete(isrTemplate: IsrTemplate): Observable<any> {
    console.log('Deleted template: ' + isrTemplate.templateName);
    return new Observable<any>();
  }

  // todo update with real data
  getIsrTemplates(): IsrTemplate[] {
    return [
      {
        subject: 'ELA',
        assessmentType: 'IAB',
        status: this.getConfigured(new Date('Jan 4, 2020 13:45')),
        templateName: this.getTemplateReportName('ELA', 'IAB'),
        location: './',
        uploadedDate: new Date('Jan 4, 2020')
      },
      {
        subject: 'ELA',
        assessmentType: 'ICA',
        status: this.getConfigured(new Date('Feb 4, 2020 09:23')),
        templateName: this.getTemplateReportName('ELA', 'ICA'),
        location: './',
        uploadedDate: new Date('Feb 4, 2020')
      },
      {
        subject: 'ELA',
        assessmentType: 'Summative',
        status: this.getConfigured(new Date('Mar 10, 2020 11:07')),
        templateName: this.getTemplateReportName('ELA', 'Summative'),
        location: './',
        uploadedDate: new Date('Mar 10, 2020')
      },
      {
        subject: 'ELPAC',
        assessmentType: 'Summative',
        status: this.getNotConfigured(),
        templateName: null,
        location: null,
        uploadedDate: null
      },
      {
        subject: 'Math',
        assessmentType: 'IAB',
        status: this.getConfigured(new Date('Jan 4, 2020 13:46')),
        templateName: this.getTemplateReportName('ELA', 'IAB'),
        location: './templates/',
        uploadedDate: new Date('Jan 4, 2020')
      },
      {
        subject: 'Math',
        assessmentType: 'ICA',
        status: this.getNotConfigured(),
        templateName: null,
        location: null,
        uploadedDate: null
      },
      {
        subject: 'Math',
        assessmentType: 'Summative',
        status: this.getConfigured(new Date('June 4, 2020 18:19')),
        templateName: this.getTemplateReportName('Math', 'Summative'),
        location: './',
        uploadedDate: new Date('June 4, 2020')
      }
    ];
  }

  public getTemplateFile(): Observable<any> {
    // TODO: Replace with call to real file location
    // TODO - hmm, need the real reference template in a common lib i guess
    const referenceTemplate = '/assets/template/reference-template.html';
    return this.http
      .get(referenceTemplate)
      .pipe(
        map(
          response =>
            new Download(
              'reference-template.html',
              new Blob([response.text()], { type: 'text/html; charset=utf-8' })
            )
        )
      );
  }
}
