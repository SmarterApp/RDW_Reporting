import { ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';

export const AssessmentTypeOrdering = ordering(ranking([ 'sum', 'ica', 'iab' ]));

export const SubjectOrdering = ordering(ranking([ 'Math', 'ELA' ]));

export const ClaimCodeOrdering = ordering(ranking([ '1', 'SOCK_2', '3', 'SOCK_R', 'SOCK_LS', '2-W', '4-CR' ]));

export const BooleanOrdering = ordering(ranking([ 'yes', 'no', 'undefined' ]));

export const CompletenessOrdering = ordering(ranking([ 'Complete', 'Partial' ]));
