import { Injectable } from '@angular/core';
import { AssessmentExam } from '../assessments/model/assessment-exam.model';
import { FilterBy } from '../assessments/model/filter-by.model';
import { Exam } from '../assessments/model/exam.model';
import { ExamFilterService } from '../assessments/filters/exam-filters/exam-filter.service';
import { CsvBuilder } from './csv-builder.service';
import { StudentHistoryExamWrapper } from '../student/model/student-history-exam-wrapper.model';
import { Student } from '../student/model/student.model';
import { ExportItemsRequest } from '../assessments/model/export-items-request.model';
import { RequestType } from '../shared/enum/request-type.enum';
import { ExportWritingTraitsRequest } from '../assessments/model/export-writing-trait-request.model';
import { ExportTargetReportRequest } from '../assessments/model/export-target-report-request.model';
import { Assessment } from '../assessments/model/assessment.model';
import { ordering } from '@kourge/ordering';
import { ranking } from '@kourge/ordering/comparator';
import { Observable } from 'rxjs/Observable';
import { SubjectService } from '../subject/subject.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CsvExportService {

  constructor(private examFilterService: ExamFilterService,
              private csvBuilder: CsvBuilder,
              private subjectService: SubjectService) {
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
    const sourceData: any[] = [];

    // TODO: Is this filter needed?  I think we pass in the filtered exam collection we wouldn't need to
    // TODO: apply the filter yet again here.
    assessmentExams.forEach((assessmentExam: AssessmentExam) => {
      const filteredExams = this.examFilterService.filterExams(assessmentExam.exams, assessmentExam.assessment, filterBy);
      filteredExams.forEach((exam) => {
        sourceData.push({
          assessment: assessmentExam.assessment,
          exam: exam
        });
      });
    });

    const getStudent = (item) => item.exam.student;
    const getExam = (item) => item.exam;
    const getAssessment = (item) => item.assessment;
    const getNonIABAssessment = (item) => item.assessment.isIab ? null : item.assessment;
    const getIABExam = (item) => item.assessment.isIab ? item.exam : null;
    const getNonIABExam = (item) => item.assessment.isIab ? null : item.exam;

    this.getSubjectScorableClaims(sourceData, getNonIABAssessment).subscribe(subjectClaims => {
      const builder = this.csvBuilder.newBuilder()
        .withFilename(filename)
        .withStudent(getStudent)
        .withExamDateAndSession(getExam)
        .withSchool(getExam)
        .withSchoolYear(getExam)
        .withAssessmentTypeNameAndSubject(getAssessment)
        .withExamGradeAndStatus(getExam)
        .withAchievementLevel(getNonIABAssessment, getNonIABExam)
        .withReportingCategory(getAssessment, getIABExam)
        .withScoreAndErrorBand(getExam);

      subjectClaims.forEach(entry => {
        builder.withClaimScores(
          entry.subject,
          entry.claims,
          getAssessment,
          (item) => !item.assessment.isIab && item.assessment.subject === entry.subject ? item.exam : null
        );
      });

      builder
        .withGender(getStudent)
        .withStudentContext(getExam, ethnicities)
        .withAccommodationCodes(getExam)
        .build(sourceData);
    });
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

    const getExam = (wrapper: StudentHistoryExamWrapper) => wrapper.exam;
    const getAssessment = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment;
    const getNonIABAssessment = (item) => item.assessment.isIab ? null : item.assessment;
    const getIABExam = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment.isIab ? wrapper.exam : null;
    const getNonIABExam = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment.isIab ? null : wrapper.exam;

    this.getSubjectScorableClaims(wrappers, getNonIABAssessment).subscribe(subjectClaims => {
      const builder = this.csvBuilder.newBuilder()
        .withFilename(filename)
        .withStudent(getStudent)
        .withExamDateAndSession(getExam)
        .withSchool(getExam)
        .withSchoolYear(getExam)
        .withAssessmentTypeNameAndSubject(getAssessment)
        .withExamGradeAndStatus(getExam)
        .withAchievementLevel(getNonIABAssessment, getNonIABExam)
        .withReportingCategory(getAssessment, getIABExam)
        .withScoreAndErrorBand(getExam)

      subjectClaims.forEach(entry => {
        builder.withClaimScores(
          entry.subject,
          entry.claims,
          getAssessment,
          (item) => !item.assessment.isIab && item.assessment.subject === entry.subject ? item.exam : null
        );
      });

      builder
        .withAccommodationCodes(getExam)
        .build(wrappers);
    });
  }

  exportResultItems(exportRequest: ExportItemsRequest,
                    filename: string) {

    const getAssessment = () => exportRequest.assessment;
    const getAssessmentItem = (item) => item;

    const builder = this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withItemNumber(getAssessmentItem)
      .withClaim(getAssessment, getAssessmentItem)
      .withTarget(getAssessmentItem)
      .withItemDifficulty(getAssessmentItem)
      .withStandards(getAssessmentItem)
      .withFullCredit(getAssessmentItem, exportRequest.showAsPercent);

      if (exportRequest.type === RequestType.DistractorAnalysis) {
        builder.withItemAnswerKey(getAssessmentItem);
      }

      builder
        .withPoints(getAssessmentItem, exportRequest.pointColumns, exportRequest.showAsPercent)
        .build(exportRequest.assessmentItems);
  }

  exportWritingTraitScores(exportRequest: ExportWritingTraitsRequest,
                           filename: string) {

    const compositeRows: any[] = [];
    let maxPoints: number = 0;

    exportRequest.assessmentItems.forEach((item, i) => {

      exportRequest.summaries[i].rows.forEach(summary => {
        compositeRows.push({
          assessmentItem: item,
          writingTraitAggregate: summary
        });

        if (summary.trait.maxPoints > maxPoints) maxPoints = summary.trait.maxPoints;
      });

    });

    const getAssessment = () => exportRequest.assessment;
    const getAssessmentItem = (item) => item.assessmentItem;

    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withClaim(getAssessment, getAssessmentItem)
      .withTarget(getAssessmentItem)
      .withItemDifficulty(getAssessmentItem)
      .withStandards(getAssessmentItem)
      .withFullCredit(getAssessmentItem, exportRequest.showAsPercent)
      .withPerformanceTaskWritingType(getAssessmentItem)
      .withWritingTraitAggregate((item) => item.writingTraitAggregate, maxPoints, exportRequest.showAsPercent)
      .build(compositeRows);
  }

  exportTargetScoresToCsv(exportRequest: ExportTargetReportRequest,
                           filename: string) {

    const getAssessment = () => exportRequest.assessment;
    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withGroupName(() => exportRequest.group)
      .withSchoolYear(() => <Exam>{ schoolYear: exportRequest.schoolYear})
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withScoreAndErrorBand(() => <Exam>{ score: exportRequest.averageScaleScore, standardError: exportRequest.standardError})
      .withTargetReportAggregate(getAssessment, (item) => item)
      .build(exportRequest.targetScoreRows);

  }

  /**
   * Scans the provided data for what scorable claims are present and returns a collection of
   * subject - scorable claim collection pairs to iterate over when generating export columns
   *
   * @param {any[]} data the data to scan
   * @param {(datum) => Assessment} getAssessment used to get the assessment from a data entry
   * @returns {Observable<SubjectScorableClaims[]>} subject - scorable claim collection pairs present in the given data set
   */
  private getSubjectScorableClaims(data: any[], getAssessment: (datum) => Assessment): Observable<SubjectScorableClaims[]> {
    return this.subjectService.getSubjectCodes().pipe(
      map(subjects => {
        return (data || []).reduce((subjectClaims, datum) => {
          const assessment = getAssessment(datum);
          if (assessment != null) {
            const { subject, claimCodes } = assessment;
            const entry = subjectClaims.find(subjectClaim => subjectClaim.subject === subject);
            if (entry == null) {
              subjectClaims.push({
                subject: subject,
                claims: claimCodes.concat()
              });
            }
          }
          return subjectClaims;
        }, []).sort(
          ordering(ranking(subjects)).on(({subject}) => subject).compare
        );
      })
    );
  }

}

interface SubjectScorableClaims {
  subject: string;
  claims: string[];
}
