import { Injectable } from "@angular/core";
import { AssessmentExam } from "../assessments/model/assessment-exam.model";
import { FilterBy } from "../assessments/model/filter-by.model";
import { Exam } from "../assessments/model/exam.model";
import { ExamFilterService } from "../assessments/filters/exam-filters/exam-filter.service";
import { CsvBuilder } from "./csv-builder.service";
import { StudentHistoryExamWrapper } from "../student/model/student-history-exam-wrapper.model";
import { Student } from "../student/model/student.model";
import { ExportItemsRequest} from "../assessments/model/export-items-request.model";
import { RequestType } from "../shared/enum/request-type.enum";
import {ExportWritingTraitsRequest} from "../assessments/model/export-writing-trait-request.model";

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
                        ethnicities: string[],
                        filename: string) {
    let sourceData: any[] = [];

    // TODO: Is this filter needed?  I think we pass in the filtered exam collection we wouldn't need to
    // TODO: apply the filter yet again here.
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
      .withSchool(getExam)
      .withSchoolYear(getExam)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withExamGradeAndStatus(getExam)
      .withAchievementLevel(getNonIABExam)
      .withReportingCategory(getIABExam)
      .withScoreAndErrorBand(getExam)
      .withMathClaimScores(getNonIABMathExam)
      .withELAClaimScores(getNonIABElaExam)
      .withGender(getStudent)
      .withStudentContext(getExam, ethnicities)
      .withAccommodationCodes(getExam)
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
    let getNonIABMathExam = (wrapper: StudentHistoryExamWrapper) => !wrapper.assessment.isIab && wrapper.assessment.subject === 'Math' ? wrapper.exam : null;
    let getNonIABElaExam = (wrapper: StudentHistoryExamWrapper) => !wrapper.assessment.isIab && wrapper.assessment.subject === 'ELA' ? wrapper.exam : null;

    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withStudent(getStudent)
      .withExamDateAndSession(getExam)
      .withSchool(getExam)
      .withSchoolYear(getExam)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withExamGradeAndStatus(getExam)
      .withAchievementLevel(getNonIABExam)
      .withReportingCategory(getIABExam)
      .withScoreAndErrorBand(getExam)
      .withMathClaimScores(getNonIABMathExam)
      .withELAClaimScores(getNonIABElaExam)
      .withAccommodationCodes(getExam)
      .build(wrappers);
  }

  exportResultItems(exportRequest: ExportItemsRequest,
                    filename: string) {

    let getAssessment = () => exportRequest.assessment;
    let getAssessmentItem = (item) => item;

    let builder = this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withItemNumber(getAssessmentItem)
      .withClaim(getAssessmentItem)
      .withTarget(getAssessmentItem)
      .withItemDifficulty(getAssessmentItem)
      .withStandards(getAssessmentItem)
      .withFullCredit(getAssessmentItem, exportRequest.showAsPercent);

      if (exportRequest.type == RequestType.DistractorAnalysis) {
        builder = builder.withItemAnswerKey(getAssessmentItem)
      }

      builder.withPoints(getAssessmentItem, exportRequest.pointColumns, exportRequest.showAsPercent)
      .build(exportRequest.assessmentItems);
  }

  exportWritingTraitScores(exportRequest: ExportWritingTraitsRequest,
                           filename: string) {

    let compositeRows: any[] = [];
    let maxPoints: number = 0;

    // since there can be multiple items, we need to iterate over multiple summary table rows if there are multiple items that have writing trait scores
    //  here we flatten the items and summary rows into a single array the CSV builder can iterate over
    exportRequest.assessmentItems.forEach((item, i) => {

      exportRequest.summaries[i].rows.forEach(summary => {
        compositeRows.push({
          assessmentItem: item,
          writingTraitAggregate: summary
        });

        if (summary.trait.maxPoints > maxPoints) maxPoints = summary.trait.maxPoints;
      });

    });

    let getAssessmentItem = (item) => item.assessmentItem;

    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withAssessmentTypeNameAndSubject(() => exportRequest.assessment)
      .withItemNumber(getAssessmentItem)
      .withClaim(getAssessmentItem)
      .withTarget(getAssessmentItem)
      .withItemDifficulty(getAssessmentItem)
      .withStandards(getAssessmentItem)
      .withFullCredit(getAssessmentItem, exportRequest.showAsPercent)
      .withPerformanceTaskWritingType(getAssessmentItem)
      .withWritingTraitAggregate((item) => item.writingTraitAggregate, maxPoints, exportRequest.showAsPercent)
      .build(compositeRows);
  }
}
