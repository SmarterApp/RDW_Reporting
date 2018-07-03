import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import { EmbeddedLanguages } from "./language-settings";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { SubjectService } from "../../subject/subject.service";
import { Utils } from "../support/support";

const EmptyObservable = of({});
const AssessmentTypes: string[] = ["iab", "ica", "sum"];

@Injectable()
export class RdwTranslateLoader implements TranslateLoader {

  private clientTranslationsLoader;
  private serverTranslationsLoader;

  constructor(http: HttpClient,
              private subjectService: SubjectService) {
    this.clientTranslationsLoader = new TranslateHttpLoader(http, '/assets/i18n/', '.json');
    this.serverTranslationsLoader = new TranslateHttpLoader(http, '/api/translations/', '');
  }

  getTranslation(languageCode: string): Observable<any> {
    return forkJoin(
      this.getClientTranslations(languageCode),
      this.getServerTranslations(languageCode),
      this.subjectService.getSubjectCodes()
    ).pipe(
      map(([ clientTranslations, serverTranslations, subjects ]) => {
        const asmtTranslations = this.createSubjectTranslations(subjects, serverTranslations);
        return _.merge(clientTranslations, asmtTranslations, serverTranslations);
      })
    );
  };

  private getClientTranslations(languageCode: string): Observable<any> {
    return EmbeddedLanguages.indexOf(languageCode) != -1
      ? this.clientTranslationsLoader.getTranslation(languageCode)
      : EmptyObservable;
  }

  private getServerTranslations(languageCode: string): Observable<any> {
    return this.serverTranslationsLoader.getTranslation(languageCode)
      .pipe(
        catchError(() => EmptyObservable)
      );
  }

  /**
   * Create combined assessment type labels based upon the subject-scoped
   * assessment type labels for all subjects.  These labels should be used when referencing
   * an assessment type outside the scope of a subject.
   * Example {"common.assessment-type.sum.short-name": "Summative/Final/Something Else"}
   *
   * @param {string[]} subjects The ordered subjects in the system
   * @param serverTranslations  The backend-provided translations
   * @returns {any} A translation payload containing combined assessment type labels
   */
  private createSubjectTranslations(subjects: string[], serverTranslations: any): any {
    const subjectTranslations: any = {};
    for (let assessmentType of AssessmentTypes) {
      const labels: string[] = [];
      for (let subject of subjects) {
        const label = _.get(serverTranslations, `subject.${subject}.asmt-type.${assessmentType}.name`);
        if (Utils.isNullOrUndefined(label) || labels.indexOf(label) >= 0) continue;

        labels.push(label);
      }

      _.set(subjectTranslations, `common.assessment-type.${assessmentType}.short-name`, labels.join("/"));
    }

    return subjectTranslations;
  }

}
