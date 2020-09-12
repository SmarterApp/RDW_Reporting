import { Inject, Injectable } from '@angular/core';
import { TranslateDatePipe } from '../../../shared/i18n/translate-date.pipe';
import { IsrTemplate } from '../model/isr-template';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AdminServiceRoute } from '../../../shared/service-route';
import {
  DATA_CONTEXT_URL,
  DataService
} from '../../../shared/data/data.service';

const ResourceContext = `${AdminServiceRoute}/templates`;
const toSubjectKey = subject => 'subject.' + subject + '.name';
const toAssmtTypeKey = (sub, assmt) =>
  'subject.' + sub + '.asmt-type.' + assmt + '.name';

@Injectable()
export class IsrTemplateService {
  constructor(
    private dataService: DataService,
    private datePipe: TranslateDatePipe,
    private translateService: TranslateService,
    @Inject(DATA_CONTEXT_URL) private contextUrl: string = '/api'
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

  delete(subject: string, assessmentType: string): Observable<any> {
    return this.dataService.delete(
      `${ResourceContext}/${subject}/${assessmentType}`
    );
  }

  getIsrTemplates(): Observable<IsrTemplate[]> {
    return this.dataService.get(`${ResourceContext}`).pipe(
      map((sourceTemplateInfoList: any[]) => {
        return sourceTemplateInfoList.map(source => this.toIsrTemplate(source));
      })
    );
  }

  public getTemplateFile() {
    window.open(`${this.contextUrl}${ResourceContext}/reference`, '_blank');
  }

  /**
   * Download the temaplate file.
   *
   * @param subjectCode subject code like Math, ELA, etc.
   * @param assessmentType the assessment type: iab, ica, or sum.
   */
  public downloadTemplateFile(subjectCode, assessmentType) {
    window.open(
      `${this.contextUrl}${ResourceContext}/${subjectCode}/${assessmentType}`,
      '_blank'
    );
  }

  public uploadTemplateFile(
    file: File,
    fileName: string,
    subjectCode: string,
    assessmentType: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, fileName);

    return this.dataService.post(
      `${ResourceContext}/${subjectCode}/${assessmentType}`,
      formData
    );
  }

  /**
   * Convert record from REST call to IsrTemplate.
   *
   * @param sourceTemplateInfo
   */
  private toIsrTemplate(sourceTemplateInfo: any): IsrTemplate {
    const rawDateString = sourceTemplateInfo.lastModified;
    const uploadedDate = rawDateString ? new Date(rawDateString) : null;
    const status = uploadedDate
      ? this.getConfigured(uploadedDate)
      : this.getNotConfigured();

    const subjectCode = sourceTemplateInfo.subjectCode;
    const assessmentType = sourceTemplateInfo.assessmentType;

    return {
      assessmentType: {
        label: toAssmtTypeKey(subjectCode, assessmentType),
        value: assessmentType
      },
      assessmentTypeSort: assessmentType,
      subject: { label: toSubjectKey(subjectCode), value: subjectCode },
      subjectSort: subjectCode,
      status: status,
      templateName: this.getTemplateReportName(subjectCode, assessmentType),
      uploadedDate: uploadedDate
    };
  }
}
