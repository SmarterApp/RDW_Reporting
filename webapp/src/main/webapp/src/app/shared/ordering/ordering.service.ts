import { Injectable } from '@angular/core';
import { SubjectService } from '../../subject/subject.service';
import { Ordering, ordering } from '@kourge/ordering';
import { Observable } from 'rxjs';
import { ranking } from '@kourge/ordering/comparator';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderingService {
  constructor(private subjectService: SubjectService) {}

  public getSubjectOrdering(): Observable<Ordering<string>> {
    return this.subjectService
      .getSubjectCodes()
      .pipe(map(codes => ordering(ranking(codes))));
  }

  /**
   * @deprecated use getSubjectDefinitions() directly
   *
   * @param subject
   * @param assessmentType
   */
  public getScorableClaimOrdering(
    subject: string,
    assessmentType: string
  ): Observable<Ordering<any>> {
    return this.subjectService
      .getSubjectDefinition(subject, assessmentType)
      .pipe(
        map(definition =>
          ordering(ranking(definition == null ? [] : definition.scorableClaims))
        )
      );
  }

  /**
   * @deprecated use getSubjectDefinitions() directly
   *
   * @param subject
   * @param assessmentType
   */
  public getAltScoreOrdering(
    subject: string,
    assessmentType: string
  ): Observable<Ordering<any>> {
    return this.subjectService
      .getSubjectDefinition(subject, assessmentType)
      .pipe(
        map(definition =>
          ordering(
            ranking(definition == null ? [] : definition.alternateScoreCodes)
          )
        )
      );
  }
}
