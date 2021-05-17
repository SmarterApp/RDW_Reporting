import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { get, merge, set } from 'lodash';
import { Injectable, Optional } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { EmbeddedLanguages } from './language-settings';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubjectService } from '../../subject/subject.service';
import { UserService } from '../security/service/user.service';

const EmptyObservable = of({});
const AssessmentTypes: string[] = ['iab', 'ica', 'sum'];
const defaultUserService = <UserService>{
  getUser: () => of({ anonymous: true })
};

@Injectable()
export class RdwTranslateLoader implements TranslateLoader {
  private clientTranslationsLoader: TranslateLoader;

  constructor(
    private http: HttpClient,
    private subjectService: SubjectService,
    @Optional()
    private userService: UserService = defaultUserService
  ) {
    this.clientTranslationsLoader = new TranslateHttpLoader(
      http,
      '/assets/i18n/',
      '.json'
    );
  }

  getTranslation(languageCode: string): Observable<any> {
    return this.userService
      .getUser()
      .pipe(
        mergeMap(user =>
          user.anonymous || user.tenantName == null
            ? this.getClientTranslations(languageCode)
            : this.getUserTranslations(languageCode)
        )
      );
  }

  getTenantTranslation(
    languageCode: string,
    tenantKey: string
  ): Observable<any> {
    if (tenantKey == null) {
      return this.getClientTranslations(languageCode);
    }
    return forkJoin(
      this.getClientTranslations(languageCode),
      this.getServerTranslations(languageCode, tenantKey)
    ).pipe(
      map(([clientTranslations, serverTranslations]) =>
        merge(clientTranslations, serverTranslations)
      )
    );
  }

  private getClientTranslations(languageCode: string): Observable<any> {
    return EmbeddedLanguages.indexOf(languageCode) !== -1
      ? this.clientTranslationsLoader.getTranslation(languageCode)
      : EmptyObservable;
  }

  private getServerTranslations(
    languageCode: string,
    tenantKey?: string
  ): Observable<any> {
    if (!tenantKey) {
      // Returns all translations for user's tenant, including overrides.
      return this.http.get(`/api/translations/${languageCode}`);
    }

    // Returns default translation for specified tenant, but not the overrides.
    const params = { tenantKey };
    return this.http.get(`/api/translations/tenantDefaults/${languageCode}`, {
      params
    });
  }

  private getUserTranslations(languageCode: string) {
    return forkJoin(
      this.getClientTranslations(languageCode),
      this.getServerTranslations(languageCode).pipe(catchError(() => of({}))),
      this.subjectService.getSubjectCodes().pipe(catchError(() => of([])))
    ).pipe(
      map(([clientTranslations, serverTranslations, subjects]) =>
        merge(
          clientTranslations,
          // the side effects of this method are overwriting defaults in the clients en.json...
          subjects.length > 0
            ? this.createSubjectTranslations(subjects, serverTranslations)
            : {},
          serverTranslations
        )
      )
    );
  }

  /**
   * TODO write this such that there are no side-effects
   * This method takes the server translations and creates a
   * short-name entry for the given subjects and existing subject assessment labels
   *
   * Create combined assessment type labels based upon the subject-scoped
   * assessment type labels for all subjects.  These labels should be used when referencing
   * an assessment type outside the scope of a subject.
   * Example {"common.assessment-type.sum.short-name": "Summative/Final/Something Else"}
   *
   * @param {string[]} subjects The ordered subjects in the system
   * @param serverTranslations  The backend-provided translations
   * @returns {any} A translation payload containing combined assessment type labels
   */
  private createSubjectTranslations(
    subjects: string[],
    serverTranslations: any
  ): any {
    const subjectTranslations: any = {};
    for (let assessmentType of AssessmentTypes) {
      const labels: string[] = [];
      for (let subject of subjects) {
        const label = get(
          serverTranslations,
          `subject.${subject}.asmt-type.${assessmentType}.name`
        );
        if (label == null || labels.indexOf(label) >= 0) continue;

        labels.push(label);
      }

      set(
        subjectTranslations,
        `common.assessment-type.${assessmentType}.short-name`,
        labels.join('/')
      );
    }

    return subjectTranslations;
  }
}
