import { ranking } from '@kourge/ordering/comparator';
import { Ordering, ordering } from '@kourge/ordering';

export const AssessmentTypeOrdering = ordering(ranking(['sum', 'ica', 'iab']));

export const SubjectOrdering = ordering(ranking(['Math', 'ELA']));

export const BooleanOrdering = ordering(ranking([ 'yes', 'no', 'undefined' ]));

export const CompletenessOrdering = ordering(ranking([ 'Complete', 'Partial' ]));

export const SubjectClaimOrder: Map<string, string[]> = new Map([
  ['Math', ['1', '2', '3', '4']],
  ['ELA', ['1-LT', '1-IT', '2-W', '3-L', '3-S', '4-CR']]
]);

export const SubjectClaimOrderings: Map<string, Ordering<string>> = new Map([
  ['Math', ordering(ranking(SubjectClaimOrder.get('Math')))],
  ['ELA', ordering(ranking(SubjectClaimOrder.get('ELA')))]
]);
