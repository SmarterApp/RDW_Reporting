import { Injectable } from "@angular/core";
import { AssessmentExam } from "../assessments/model/assessment-exam.model";
import { FilterBy } from "../assessments/model/filter-by.model";
import { Exam } from "../assessments/model/exam.model";
import { ExamFilterService } from "../assessments/filters/exam-filters/exam-filter.service";
import { CsvBuilder } from "./csv-builder.service";
import { StudentHistoryExamWrapper } from "../student/model/student-history-exam-wrapper.model";
import { Student } from "../student/model/student.model";

@Injectable()
export class CsvExportService {

  constructor(private examFilterService: ExamFilterService,
              private csvBuilder: CsvBuilder) {
  }

  /**
   * Export a filtered collection of AssessmentExams as a CSV download.
   *
   * @param assessmentExams The source AssessmentExam instances
   * @param filterBy        The filter criteria
   * @param filename        The export file name
   */
  exportAssessmentExams(assessmentExams: AssessmentExam[],
                        filterBy: FilterBy,
                        filename: string) {
    let sourceData: any[] = [];
    assessmentExams.forEach((assessmentExam: AssessmentExam) => {
      let filteredExams: Exam[] = this.examFilterService.filterExams(assessmentExam, filterBy);
      filteredExams.forEach((exam) => {
        sourceData.push({
          assessment: assessmentExam.assessment,
          exam: exam
        });
      });
    });

    let getStudent = (item) => item.exam.student;
    let getExam = (item) => item.exam;
    let getAssessment = (item) => item.assessment;
    let getIABExam = (item) => item.assessment.isIab ? item.exam : null;
    let getNonIABExam = (item) => item.assessment.isIab ? null: item.exam;
    let getNonIABMathExam = (item) => !item.assessment.isIab && item.assessment.subject === 'MATH' ? item.exam : null;
    let getNonIABElaExam = (item) => !item.assessment.isIab && item.assessment.subject === 'ELA' ? item.exam : null;

    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withStudent(getStudent)
      .withExamDateAndSession(getExam)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withExamGradeAndStatus(getExam)
      .withAchievementLevel(getNonIABExam)
      .withReportingCategory(getIABExam)
      .withScoreAndErrorBand(getExam)
      .withMathClaimScores(getNonIABMathExam)
      .withELAClaimScores(getNonIABElaExam)
      .withGender(getStudent)
      .withStudentContext(getExam)
      .build(sourceData);
  }

  /**
   * Export a collection of StudentHistoryExamWrapper instances as a CSV download.
   *
   * @param wrappers    The exam history wrappers
   * @param getStudent  A student provider
   * @param filename    The export csv filename
   */
  exportStudentHistory(wrappers: StudentHistoryExamWrapper[],
                       getStudent: () => Student,
                       filename: string) {

    let getExam = (wrapper: StudentHistoryExamWrapper) => wrapper.exam;
    let getAssessment = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment;
    let getIABExam = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment.isIab ? wrapper.exam : null;
    let getNonIABExam = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment.isIab ? null: wrapper.exam;
    let getNonIABMathExam = (wrapper: StudentHistoryExamWrapper) => !wrapper.assessment.isIab && wrapper.assessment.subject === 'MATH' ? wrapper.exam : null;
    let getNonIABElaExam = (wrapper: StudentHistoryExamWrapper) => !wrapper.assessment.isIab && wrapper.assessment.subject === 'ELA' ? wrapper.exam : null;

    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withStudent(getStudent)
      .withExamDateAndSession(getExam)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withExamGradeAndStatus(getExam)
      .withAchievementLevel(getNonIABExam)
      .withReportingCategory(getIABExam)
      .withScoreAndErrorBand(getExam)
      .withMathClaimScores(getNonIABMathExam)
      .withELAClaimScores(getNonIABElaExam)
      .build(wrappers);
  }
}
