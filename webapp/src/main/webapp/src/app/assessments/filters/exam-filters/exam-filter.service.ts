import { Injectable } from "@angular/core";
import { ExamFilter } from "../../model/exam-filter.model";
import { FilterBy } from "../../model/filter-by.model";
import { Exam } from "../../model/exam.model";
import { Assessment } from "../../model/assessment.model";
import { Utils } from "../../../shared/support/support";

@Injectable()
export class ExamFilterService {

  private filterDefinitions = [
    new ExamFilter('offGradeAssessment', 'common.filters.test.off-grade-assessment', 'exam-filter.off-grade', this.filterByEnrolledGradeOff),
    new ExamFilter('transferAssessment', 'common.filters.test.transfer-assessment', 'exam-filter.transfer', this.filterByTransferAssessment),
    new ExamFilter('administration', 'common.filters.status.administration', 'common.administration-condition', this.filterByAdministrativeCondition, x => x.isInterim),
    new ExamFilter('summativeStatus', 'common.filters.status.summative', 'common.administration-condition', this.filterByAdministrativeCondition, x => x.isSummative),
    new ExamFilter('completion', 'common.completeness-form-control.label', 'common.completeness', this.filterByCompleteness),
    new ExamFilter('genders', 'common.filters.student.gender', 'common.gender', this.filterByGender),
    new ExamFilter('migrantStatus', 'common.filters.student.migrant-status', 'common.polar', this.filterByMigrantStatus),
    new ExamFilter('plan504', 'common.filters.student.504-plan', 'common.polar', this.filterByplan504),
    new ExamFilter('iep', 'common.filters.student.iep', 'common.polar', this.filterByIep),
    new ExamFilter('limitedEnglishProficiency', 'common.filters.student.limited-english-proficiency', 'common.polar', this.filterByLimitedEnglishProficiency),
    new ExamFilter('elasCodes', 'common.filters.student.elas', 'common.elas', this.filterByElasCode),
    new ExamFilter('ethnicities', 'common.filters.student.ethnicity', 'common.ethnicity', this.filterByEthnicity)
  ];

  getFilterDefinitions(): ExamFilter[] {
    return this.filterDefinitions;
  }

  getFilterDefinitionFor(filterName: string): ExamFilter {
    return this.filterDefinitions.find(x => x.name == filterName);
  }

  /**
   * Filter exams within an AssessmentExam.
   *
   * @param exams  The exams
   * @param assessment The assessment
   * @param filterBy   The currently-applied filters
   * @returns {Exam[]} The filtered exams
   */
  filterExams(exams: Exam[], assessment: Assessment, filterBy: FilterBy): Exam[] {
    if (filterBy == null)
      return exams;

    let filters = this.getFilters(filterBy);
    for (let filter of filters) {
      let filterDefinition = this.getFilterDefinitionFor(filter);

      if (filterDefinition.precondition(assessment)) {
        let filterValue = filterBy[ filter ];

        if (filter == 'offGradeAssessment')
          filterValue = assessment.grade;
        else if (filter == 'ethnicities')
          filterValue = filterBy.filteredEthnicities;
        else if (filter == 'genders')
          filterValue = filterBy.filteredGenders;
        else if (filter == 'elasCodes')
          filterValue = filterBy.filteredElasCodes;

        exams = exams.filter(exam => filterDefinition.apply(exam, filterValue));
      }
    }

    return exams;
  }

  /**
   * Filter a collection of items that can be resolved to both an Assessment and Exam.
   *
   * @param assessmentProvider  Function to provide the Assessment for the given item
   * @param examProvider        Function to provide the Exam for the given item.
   * @param items               The source items
   * @param filterBy            The currently-applied filters
   * @returns {any[]} The filtered items
   */
  filterItems(
    assessmentProvider: (item: any) => Assessment,
    examProvider: (item: any) => Exam,
    items: any[],
    filterBy: FilterBy): any[] {

    if (filterBy == null) {
      return items;
    }

    let results: any[] = items;
    let filters = this.getFilters(filterBy);
    for (let filter of filters) {
      let filterDefinition = this.getFilterDefinitionFor(filter);

      results = results
        .filter((item) => {
          let assessment: Assessment = assessmentProvider(item);
          if (!filterDefinition.precondition(assessment)) return true;

          let exam: Exam = examProvider(item);
          let filterValue = filterBy[ filter ];

          if (filter == 'offGradeAssessment') {
            filterValue = assessment.grade;
          }
          else if (filter == 'ethnicities') {
            filterValue = filterBy.filteredEthnicities;
          } else if (filter == 'genders') {
            filterValue = filterBy.filteredGenders;
          } else if (filter == 'elasCodes') {
            filterValue = filterBy.filteredElasCodes;
          }

          return filterDefinition.apply(exam, filterValue);
        });
    }

    return results;
  }

  private getFilters(filterBy: FilterBy): string[] {
    let filters = filterBy.all;
    if (filters.some(x => x.indexOf('ethnicities') > -1)) {
      // remove individual 'ethnicity.code' and add just one ethnicity
      // as ethnicities need to be evaluated all at once.
      filters = filters.filter(x => x.indexOf('ethnicities') == -1);
      filters.push('ethnicities');
    }
    if (filters.some(x => x.indexOf('genders') > -1)) {
      // remove individual 'gender.code' and add just one gender
      // as genders need to be evaluated all at once.
      filters = filters.filter(x => x.indexOf('genders') == -1);
      filters.push('genders');
    }
    if (filters.some(x => x.indexOf('elasCodes') > -1)) {
      // remove individual 'elas.code' and add just one elas
      // as elas need to be evaluated all at once.
      filters = filters.filter(x => x.indexOf('elasCodes') == -1);
      filters.push('elasCodes');
    }

    return filters;
  }

  private filterByAdministrativeCondition(exam: Exam, filterValue: any): boolean {
    return exam.administrativeCondition === filterValue;
  }

  private filterByCompleteness(exam: Exam, filterValue: any): boolean {
    return exam.completeness === filterValue;
  }

  private filterByEnrolledGradeOff(exam: Exam, filterValue: any): boolean {
    return exam.enrolledGrade === filterValue;
  }

  private filterByGender(exam: Exam, filterValue: any): boolean {
    return exam.student && !filterValue.length || filterValue.some(gender => gender == exam.student.genderCode);
  }

  private filterByElasCode(exam: Exam, filterValue: any): boolean {
    return exam.student && !filterValue.length || filterValue.some(elasCode => elasCode == exam.elasCode);
  }

  private filterByMigrantStatus(exam: Exam, filterValue: any): boolean {
    return exam.migrantStatus == Utils.polarEnumToBoolean(filterValue);
  }

  private filterByplan504(exam: Exam, filterValue: any): boolean {
    return exam.plan504 === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByIep(exam: Exam, filterValue: any): boolean {
    return exam.iep === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByLimitedEnglishProficiency(exam: Exam, filterValue: any): boolean {
    return exam.limitedEnglishProficiency === Utils.polarEnumToBoolean(filterValue);
  }

  private filterByEthnicity(exam: Exam, filterValue: any): boolean {
    return exam.student && exam.student.ethnicityCodes.some(ethnicity => filterValue.some(code => code == ethnicity));
  }

  private filterByTransferAssessment(exam: Exam, filterValue: any): boolean {
    return !filterValue || !exam.transfer;
  }
}
