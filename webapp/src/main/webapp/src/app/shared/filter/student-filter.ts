import { StudentFilterOptions } from './student-filter-options';
import { Utils } from '../support/support';
import { Student } from '../../student/search/student';

export interface StudentFilter {
  genders?: string[];
  ethnicities?: string[];
  englishLanguageAcquisitionStatuses?: string[];
  individualEducationPlans?: string[];
  limitedEnglishProficiencies?: string[];
  section504s?: string[];
  migrantStatuses?: string[];
}

export type ArrayFilter<T> = (student: T, index: number, students: T[]) => boolean;
export type StudentArrayFilter = ArrayFilter<Student>;

export function createStudentArrayFilter(filter: StudentFilter): StudentArrayFilter {
  const { isNullOrEmpty } = Utils;
  return student => {
    return (
      isNullOrEmpty(filter.genders)
      || filter.genders.includes(student.gender)
    ) && (
      isNullOrEmpty(filter.ethnicities)
      || student.ethnicities.some(ethnicity => filter.ethnicities.includes(ethnicity))
    ) && (
      isNullOrEmpty(filter.englishLanguageAcquisitionStatuses)
      || filter.englishLanguageAcquisitionStatuses.includes(student.englishLanguageAcquisitionStatus)
    ) && (
      isNullOrEmpty(filter.individualEducationPlans)
      || filter.individualEducationPlans.includes(student.individualEducationPlan)
    ) && (
      isNullOrEmpty(filter.limitedEnglishProficiencies)
      || filter.limitedEnglishProficiencies.includes(student.limitedEnglishProficiency)
    ) && (
      isNullOrEmpty(filter.section504s)
      || filter.section504s.includes(student.section504)
    ) && (
      isNullOrEmpty(filter.migrantStatuses)
      || filter.migrantStatuses.includes(student.migrantStatus)
    );
  };
}

export function countFilters(filter: StudentFilter): number {
  return Object.entries(filter).reduce((count, [key, value]) => {
    return count + (value != null ? value.length : 0);
  }, 0);
}
