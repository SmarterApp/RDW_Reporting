import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CsvColumn } from "./csv-column.model";
import { Student } from "../student/model/student.model";
import { Exam } from "../assessments/model/exam.model";
import { DatePipe, DecimalPipe } from "@angular/common";
import { Assessment } from "../assessments/model/assessment.model";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { Angular2CsvProvider } from "./angular-csv.provider";
import { AssessmentItem } from "../assessments/model/assessment-item.model";
import { isNullOrUndefined } from "util";
import { DynamicItemField } from "../assessments/model/item-point-field.model";

@Injectable()
export class CsvBuilder {
  private columns: CsvColumn[];
  private filename: string;

  constructor(private angular2csv: Angular2CsvProvider,
              private translateService: TranslateService,
              private datePipe: DatePipe,
              private numberPipe: DecimalPipe) {
    this.columns = [];
    this.filename = "export";
  }

  /**
   * Create a new builder instance with empty state.
   *
   * @returns {CsvBuilder}  A new builder instance
   */
  newBuilder(): CsvBuilder {
    return new CsvBuilder(this.angular2csv, this.translateService, this.datePipe, this.numberPipe);
  }

  /**
   * Build a tabular 2-dimensional array of columns and values from the
   * current column definitions and an array of source data.
   * Export the tabular data as a CSV download.
   *
   * @param srcData An array of source items
   */
  build(srcData: any[]): void {
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

    this.angular2csv.export(csvData, this.filename);
  }

  /**
   * General method for adding a column to the output CSV.
   *
   * @param labelKey        The column header label
   * @param dataProvider    The column data provider
   * @returns {CsvBuilder}  This builder
   */
  withColumn(labelKey: string, dataProvider: (item: any) => any) {
    let column = new CsvColumn();
    column.label = labelKey;
    column.dataProvider = dataProvider;
    this.columns.push(column);
    return this;
  }

  /**
   * The export CSV filename.
   *
   * @param filename        The export filename
   * @returns {CsvBuilder}  This builder
   */
  withFilename(filename: string) {
    this.filename = filename;
    return this;
  }

  //Methods for generating well-known columns from well-known data models

  withStudentId(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateHeader('student-id'),
      (item) => getStudent(item).ssid
    );
  }

  withStudentName(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateHeader('student-first-name'),
      (item) => getStudent(item).firstName
    ).withColumn(
      this.translateHeader('student-last-name'),
      (item) => getStudent(item).lastName
    );
  }

  withExamDate(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('submit-date-time'),
      (item) => this.datePipe.transform(getExam(item).date)
    )
  }

  withExamSession(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('assessment-session-id'),
      (item) => getExam(item).session
    )
  }

  withSchool(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('school'),
      (item) => getExam(item).school.name
    )
  }

  withAssessmentType(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateHeader('assessment-type'),
      (item) => AssessmentType[ getAssessment(item).type ]
    )
  }

  withAssessmentName(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateHeader('assessment-name'),
      (item) => getAssessment(item).name
    )
  }

  withAssessmentSubject(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateHeader('subject'),
      (item) => getAssessment(item).subject
    )
  }

  withExamGrade(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('enrolled-grade'),
      (item) => {
        let gradeCode: string = getExam(item).enrolledGrade;
        return this.translateService.instant(`labels.grades.${gradeCode}.enrolled-name`)
      }
    )
  }

  // TODO - Split out -- ?
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
      this.translateHeader('achievement-level'),
      (item) => {
        let exam: Exam = getExam(item);
        if (!exam || !exam.level) return "";

        return this.translateService.instant(`enum.achievement-level.full.${exam.level}`);
      }
    )
  }

  withAccommodationCodes(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('accommodation-codes'),
      (item) => {
        let exam: Exam = getExam(item);
        if (!exam || !exam.accommodationCodes) return "";

        return exam.accommodationCodes.join("|");
      }
    )
  }

  // TODO - Is this different than AchievementLevel now -- ?
  withReportingCategory(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.exams.cols.iab.performance'),
      (item) => {
        let exam: Exam = getExam(item);
        if (!exam || !exam.level) return "";

        return this.translateService.instant(`enum.iab-category.full.${exam.level}`);
      }
    )
  }

  withScaleScore(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('scale-score'),
      (item) => {
        let score = getExam(item).score;
        return !score ? '' : score;
      }
    )
  }

  withErrorBandMin(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('error-band-min'),
      (item) => {
        let exam: Exam = getExam(item);
        return !exam.score ? '' : exam.score - exam.standardError;
      }
    )
  }

  withErrorBandMax(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('error-band-max'),
      (item) => {
        let exam: Exam = getExam(item);
        return !exam.score ? '' : exam.score + exam.standardError;
      }
    )
  }

  withMathClaimScores(getExam: (item: any) => Exam) {
    return this.withClaimScores([ '1', 'SOCK_2', '3' ], getExam);
  }

  withELAClaimScores(getExam: (item: any) => Exam) {
    return this.withClaimScores([ 'SOCK_R', 'SOCK_LS', '2-W', '4-CR' ], getExam);
  }

  withClaimScores(claims: string[], getExam: (item: any) => Exam) {
    claims.forEach((claim, idx) => {
      this.withColumn(
        this.translateService.instant(`enum.subject-claim-code.${claim}`),
        (item) => {
          let exam: Exam = getExam(item);
          if (!exam || !exam.claimScores[ idx ].level) return "";

          return this.translateService.instant(`enum.iab-category.full.${exam.claimScores[ idx ].level}`);
        }
      )
    });

    return this;
  }

  withGender(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateHeader('gender'),
      (item) => this.translateService.instant(`enum.gender.${getStudent(item).genderCode}`)
    )
  }

  withMigrantStatus(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('migrant-status'),
      (item) => {
        let polarEnum = getExam(item).migrantStatus ? 1 : 2;
        return this.translateService.instant(`enum.polar.${polarEnum}`);
      }
    )
  }

  with504Plan(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('504-plan'),
      (item) => {
        let polarEnum = getExam(item).plan504 ? 1 : 2;
        return this.translateService.instant(`enum.polar.${polarEnum}`);
      }
    )
  }

  withIep(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('iep'),
      (item) => {
        let polarEnum = getExam(item).iep ? 1 : 2;
        return this.translateService.instant(`enum.polar.${polarEnum}`);
      }
    )
  }

  withEconomicDisadvantage(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('economic-disadvantage'),
      (item) => {
        let polarEnum = getExam(item).economicDisadvantage ? 1 : 2;
        return this.translateService.instant(`enum.polar.${polarEnum}`);
      }
    )
  }

  withLimitedEnglish(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateHeader('limited-english'),
      (item) => {
        let polarEnum = getExam(item).limitedEnglishProficiency ? 1 : 2;
        return this.translateService.instant(`enum.polar.${polarEnum}`);
      }
    )
  }

  withEthnicity(getExam: (item: any) => Exam, ethnicities: string[]) {
    for(let ethnicity of ethnicities) {
      this.withColumn(
        ethnicity,
        (item) => {
          let polarEnum = getExam(item).student.ethnicityCodes.some(code => code == ethnicity) ? 1 : 2;
          return this.translateService.instant(`enum.polar.${polarEnum}`);
        });
    }

    return this;
  }

  withItemNumber(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.items.cols.number'),
      (item) => getAssessmentItem(item).position
    );
  }

  withClaim(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateHeader('claim'),
      (item) => this.translateService.instant(`definition.claim.${getAssessmentItem(item).claim}.name`)
    );
  }

  withTarget(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateHeader('target'),
      (item) => this.translateService.instant('labels.groups.results.assessment.items.target', getAssessmentItem(item))
    );
  }

  withItemDifficulty(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.items.cols.difficulty'),
      (item) => this.translateService.instant(`enum.difficulty.${getAssessmentItem(item).difficulty}`)
    );
  }

  withStandards(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.items.cols.standard'),
      (item) => getAssessmentItem(item).commonCoreStandardIds.join(", ")
    );
  }

  withFullCredit(getAssessmentItem: (item: any) => AssessmentItem,
                 showAsPercent: boolean) {
    return this.withColumn(
      this.translateService.instant('labels.groups.results.assessment.items.cols.full-credit'),
      (item) => {
        let assessmentItem: AssessmentItem = getAssessmentItem(item);
        let fullCredit: number = showAsPercent ? assessmentItem.fullCreditAsPercent : assessmentItem.fullCredit;
        return this.numberAsString(fullCredit, showAsPercent);
      }
    );
  }

  withPoints(getAssessmentItem: (item: any) => AssessmentItem,
             pointColumns: DynamicItemField[],
             showAsPercent: boolean) {
    pointColumns.forEach(column => {
      this.withColumn(
        column.label,
        (item) => {
          let field = showAsPercent ? column.percentField : column.numberField;
          let value: number = getAssessmentItem(item)[ field ];
          if (isNullOrUndefined(value)) return "";

          return this.numberAsString(value, showAsPercent);
        }
      )
    });
    return this;
  }

  //Combination methods for commonly-associated columns

  withStudent(getStudent: (item: any) => Student) {
    return this
      .withStudentId(getStudent)
      .withStudentName(getStudent);
  }

  withScoreAndErrorBand(getExam: (item: any) => Exam) {
    return this
      .withScaleScore(getExam)
      .withErrorBandMin(getExam)
      .withErrorBandMax(getExam);
  }

  withAssessmentTypeNameAndSubject(getAssessment: (item: any) => Assessment) {
    return this
      .withAssessmentType(getAssessment)
      .withAssessmentName(getAssessment)
      .withAssessmentSubject(getAssessment);
  }

  withExamGradeAndStatus(getExam: (item: any) => Exam) {
    return this
      .withExamGrade(getExam)
      .withExamStatus(getExam);
  }

  withExamDateAndSession(getExam: (item: any) => Exam) {
    return this
      .withExamDate(getExam)
      .withExamSession(getExam);
  }

  withStudentContext(getExam: (item: any) => Exam, ethnicities) {
    return this
      .withMigrantStatus(getExam)
      .with504Plan(getExam)
      .withIep(getExam)
      .withEconomicDisadvantage(getExam)
      .withLimitedEnglish(getExam)
      .withEthnicity(getExam, ethnicities);
  }

  private numberAsString(value: Number, showAsPercent: boolean) {
    return this.numberPipe.transform(value, '1.0-0') +
      (showAsPercent ? "%" : "");
  }

  private translateHeader(header: string): string {
    return this.translateService.instant("labels.export.cols." + header);
  }
}
