import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CsvColumn } from "./csv-column.model";
import { Student } from "../student/model/student.model";
import { Exam } from "../assessments/model/exam.model";
import { DatePipe } from "@angular/common";
import { Assessment } from "../assessments/model/assessment.model";
import { AssessmentType } from "../shared/enum/assessment-type.enum";

@Injectable()
export class CsvBuilder {
  private columns: CsvColumn[];

  constructor(private translateService: TranslateService,
              private datePipe: DatePipe) {
    this.columns = [];
  }

  /**
   * Create a new builder instance with empty state.
   *
   * @returns {CsvBuilder}  A new builder instance
   */
  newBuilder(): CsvBuilder {
    return new CsvBuilder(this.translateService, this.datePipe);
  }

  /**
   * Build a tabular 2-dimensional array of columns and values from the
   * current column definitions and an array of source data.
   *
   * @param srcData An array of source items
   * @returns {string[][]}  Tabular data suitable for CSV export
   */
  build(srcData: any[]): string[][] {
    let csvData: string[][] = [];

    //Add column headers
    let headers: string[] = [];
    for (let column of this.columns) {
      headers.push(column.label);
    }
    csvData.push(headers);

    //Add data
    for (let item of srcData) {
      let rowData: any[] = [];
      for (let column of this.columns) {
        rowData.push(column.dataProvider(item));
      }
      csvData.push(rowData);
    }

    return csvData;
  }

  /**
   * General method for adding a column to the output CSV.
   *
   * @param labelKey        The column header label
   * @param dataProvider    The column data provider
   * @returns {CsvBuilder}  This builder
   */
  withColumn(labelKey: string, dataProvider: (item:any) => any) {
    let column = new CsvColumn();
    column.label = labelKey;
    column.dataProvider = dataProvider;
    this.columns.push(column);
    return this;
  }

  //Methods for generating well-known columns from well-known data models

  withStudentId(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateService.instant('labels.export.cols.student-id'),
      (item) => getStudent(item).ssid
    );
  }

  withStudentName(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateService.instant('labels.export.cols.student-name'),
      (item) => this.translateService.instant('labels.personName', getStudent(item))
    );
  }

  withExamDate(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.student.results.cols.date'),
      (item) => this.datePipe.transform(getExam(item).date)
    )
  }

  withExamSession(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.exams.cols.session'),
      (item) => getExam(item).session
    )
  }

  withAssessmentType(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('labels.export.cols.assessment-type'),
      (item) => AssessmentType[getAssessment(item).type]
    )
  }

  withAssessmentName(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('labels.student.results.cols.assessment'),
      (item) => getAssessment(item).name
    )
  }

  withAssessmentSubject(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('labels.export.cols.subject'),
      (item) => getAssessment(item).subject
    )
  }

  withExamGrade(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.student.results.cols.enrolled-grade'),
      (item) => {
        let gradeCode: string = getExam(item).enrolledGrade;
        return this.translateService.instant(`labels.grades.${gradeCode}.short-name`)
      }
    )
  }

  withExamStatus(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.exams.cols.status'),
      (item) => {
        let exam: Exam = getExam(item);
        let adminCondition: string = exam.administrativeCondition;
        let status: string = this.translateService.instant(`enum.administrative-condition.${adminCondition}`);
        if (exam.completeness === 'Partial') {
          status += " " + this.translateService.instant('enum.completeness.Partial');
        }
        return status;
      }
    )
  }

  withAchievementLevel(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.exams.cols.ica.performance'),
      (item) => {
        let exam: Exam = getExam(item);
        if (!exam) return null;

        return this.translateService.instant(`enum.achievement-level.full.${exam.level}`);
      }
    )
  }

  withReportingCategory(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.exams.cols.iab.performance'),
      (item) => {
        let exam: Exam = getExam(item);
        if (!exam) return null;

        return this.translateService.instant(`enum.iab-category.full.${exam.level}`);
      }
    )
  }

  withScaleScore(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.exams.cols.score'),
      (item) => getExam(item).score
    )
  }

  withErrorBandMin(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.export.cols.error-band-min'),
      (item) => {
        let exam: Exam = getExam(item);
        return exam.score - exam.standardError;
      }
    )
  }

  withErrorBandMax(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.export.cols.error-band-max'),
      (item) => {
        let exam: Exam = getExam(item);
        return exam.score + exam.standardError;
      }
    )
  }

  withMathClaimScores(getExam: (item: any) => Exam) {
    return this.withClaimScores(['1', 'SOCK_2', '3'], getExam);
  }

  withELAClaimScores(getExam: (item: any) => Exam) {
    return this.withClaimScores(['SOCK_R', 'SOCK_LS', '2-W', '4-CR'], getExam);
  }

  withClaimScores(claims: string[], getExam: (item: any) => Exam) {
    claims.forEach((claim, idx) => {
      this.withColumn(
        this.translateService.instant(`enum.claim-code.${claim}`),
        (item) => {
          let exam: Exam = getExam(item);
          if (!exam) return null;

          return this.translateService.instant(`enum.iab-category.full.${exam.claimScores[idx].level}`);
        }
      )
    });

    return this;
  }

  //Combination methods for commonly-associated columns

  withStudentIdAndName(getStudent: (item: any) => Student) {
    this.withStudentId(getStudent);
    this.withStudentName(getStudent);
    return this;
  }

  withScoreAndErrorBand(getExam: (item: any) => Exam) {
    this.withScaleScore(getExam);
    this.withErrorBandMin(getExam);
    this.withErrorBandMax(getExam);
    return this;
  }

  withAssessmentTypeNameAndSubject(getAssessment: (item: any) => Assessment) {
    this.withAssessmentType(getAssessment);
    this.withAssessmentName(getAssessment);
    this.withAssessmentSubject(getAssessment);
    return this;
  }

  withExamGradeAndStatus(getExam: (item: any) => Exam) {
    this.withExamGrade(getExam);
    this.withExamStatus(getExam);
    return this;
  }

  withExamDateAndSession(getExam: (item: any) => Exam) {
    this.withExamDate(getExam);
    this.withExamSession(getExam);
    return this;
  }
}
