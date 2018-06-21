import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { SubjectDefinition } from './subject';
import { join, ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';

const Subjects = [ 'Math', 'ELA' ];
const MathScorableClaims = [ '1', 'SOCK_2', '3' ];
const ELAScorableClaims = [ 'SOCK_R', 'SOCK_LS', '2-W', '4-CR' ];
const ScorableClaimsBySubject: Map<string, string[]>  = new Map([
  [ 'Math', MathScorableClaims ],
  [ 'ELA', ELAScorableClaims ]
]);


const SubjectDefinitions: SubjectDefinition[] = [
  {
    subject: 'Math',
    assessmentType: 'ica'
  },
  {
    subject: 'Math',
    assessmentType: 'iab'
  },
  {
    subject: 'Math',
    assessmentType: 'sum'
  },
  {
    subject: 'ELA',
    assessmentType: 'ica'
  },
  {
    subject: 'ELA',
    assessmentType: 'iab'
  },
  {
    subject: 'ELA',
    assessmentType: 'sum'
  }
].sort(
  join(
    ordering(ranking([ 'Math', 'ELA' ])).on<SubjectDefinition>(({ subject }) => subject).compare,
    ordering(ranking([ 'sum', 'ica', 'iab' ])).on<SubjectDefinition>(({ assessmentType }) => assessmentType).compare
  )
).map(type => {

  const iab = type.assessmentType === 'iab';
  const scorableClaims = type.subject === 'Math'
    ? MathScorableClaims
    : ELAScorableClaims;

  return Object.assign({}, type, {
    performanceLevelStandardCutoff: iab ? undefined : 3,
    performanceLevelCount: iab ? 3 : 4,
    scorableClaims: scorableClaims,
    scorableClaimPerformanceLevelCount: iab ? 0 : 3
  });
});

const DefinitionsBySubjectAndAssessmentType: { [ key: string ]: SubjectDefinition } = SubjectDefinitions.reduce((map, type) => {
  const { subject, assessmentType } = type;
  map[ `${subject}/${assessmentType}` ] = type;
  return map;
}, {});

@Injectable()
export class SubjectService {

  getSubjectCodes(): Observable<string[]> {
    return of(Subjects);
  }

  getSubjectDefinition(subject: string, assessmentType: string): Observable<SubjectDefinition> {
    return of(DefinitionsBySubjectAndAssessmentType[ `${subject}/${assessmentType}` ]);
  }

  getSubjectDefinitions(): Observable<SubjectDefinition[]> {
    return of(SubjectDefinitions);
  }

  getScorableClaimsBySubject(): Observable<Map<string, string[]>> {
    return of(ScorableClaimsBySubject);
  }

}
