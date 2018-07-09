import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CsvColumn } from './csv-column.model';
import { Student } from '../student/model/student.model';
import { Exam } from '../assessments/model/exam.model';
import { Assessment } from '../assessments/model/assessment.model';
import { Angular2CsvProvider } from './angular-csv.provider';
import { AssessmentItem } from '../assessments/model/assessment-item.model';
import { DynamicItemField } from '../assessments/model/item-point-field.model';
import { SchoolYearPipe } from '../shared/format/school-year.pipe';
import { Utils } from '../shared/support/support';
import { WritingTraitAggregate } from '../assessments/model/writing-trait-aggregate.model';
import { TranslateDatePipe } from '../shared/i18n/translate-date.pipe';
import { TranslateNumberPipe } from '../shared/i18n/translate-number.pipe';
import { ApplicationSettingsService } from '../app-settings.service';
import { AggregateTargetScoreRow, TargetReportingLevel } from '../assessments/model/aggregate-target-score-row.model';
import { SubjectDefinition } from '../subject/subject';

@Injectable()
export class CsvBuilder {
  private columns: CsvColumn[] = [];
  private filename = 'export';
  private showElas: boolean = false;
  private showLep: boolean = false;

  constructor(private angular2csv: Angular2CsvProvider,
              private translateService: TranslateService,
              private datePipe: TranslateDatePipe,
              private schoolYearPipe: SchoolYearPipe,
              private numberPipe: TranslateNumberPipe,
              private applicationSettingsService: ApplicationSettingsService) {

    // TODO technically there can be a race condition here.
    applicationSettingsService.getSettings().subscribe(settings => {
      this.showElas = settings.elasEnabled;
      this.showLep = settings.lepEnabled;
    });
  }

  /**
   * Create a new builder instance with empty state.
   *
   * @returns {CsvBuilder}  A new builder instance
   */
  newBuilder(): CsvBuilder {
    return new CsvBuilder(
      this.angular2csv,
      this.translateService,
      this.datePipe,
      this.schoolYearPipe,
      this.numberPipe,
      this.applicationSettingsService
    );
  }

  /**
   * Build a tabular 2-dimensional array of columns and values from the
   * current column definitions and an array of source data.
   * Export the tabular data as a CSV download.
   *
   * @param rows An array of source items
   */
  build(rows: any[]): void {
    this.angular2csv.export([
      this.columns.map(column => column.label),
      ...rows.map(row => this.columns.map(column => column.dataProvider(row)))
    ], this.filename);
  }

  /**
   * General method for adding a column to the output CSV.
   *
   * @param labelKey        The column header label
   * @param dataProvider    The column data provider
   * @returns {CsvBuilder}  This builder
   */
  withColumn(labelKey: string, dataProvider: (item: any) => any) {
    const column = new CsvColumn();
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

  // Methods for generating well-known columns from well-known data models

  withStudentId(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateService.instant('csv-builder.student-id'),
      (item) => getStudent(item).ssid
    );
  }

  withStudentName(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateService.instant('csv-builder.student-first-name'),
      (item) => getStudent(item).firstName ? getStudent(item).firstName : ''
    ).withColumn(
      this.translateService.instant('csv-builder.student-last-name'),
      (item) => getStudent(item).lastName ? getStudent(item).lastName : ''
    );
  }

  withExamDate(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.submit-date-time'),
      (item) => this.datePipe.transform(getExam(item).date)
    );
  }

  withExamSession(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.assessment-session-id'),
      (item) => {
        const session = getExam(item).session;
        return session ? session : '';
      }
    );
  }

  withSchool(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.school'),
      (item) => getExam(item).school.name
    );
  }

  withSchoolYear(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.school-year'),
      (item) => this.schoolYearPipe.transform(getExam(item).schoolYear)
    );
  }

  withAssessmentType(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('csv-builder.assessment-type'),
      (item) => {
        const assessment: Assessment = getAssessment(item);
        return this.translateService.instant(`subject.${assessment.subject}.asmt-type.${assessment.type}.name`);
      }
    );
  }

  withAssessmentName(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('csv-builder.assessment-name'),
      (item) => getAssessment(item).label
    );
  }

  withAssessmentSubject(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('csv-builder.subject'),
      (item) => this.translateService.instant(`subject.${getAssessment(item).subject}.name`)
    );
  }

  withExamGrade(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.enrolled-grade'),
      (item) => {
        const gradeCode: string = getExam(item).enrolledGrade;
        return this.translateService.instant(`common.enrolled-grade-label.${gradeCode}`);
      }
    );
  }

  // TODO - Split out -- ?
  withExamStatus(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-exam-columns.status'),
      (item) => {
        const exam: Exam = getExam(item);
        const adminCondition: string = exam.administrativeCondition;
        let status: string = adminCondition ? this.translateService.instant(`common.administration-condition.${adminCondition}`) : '';
        if (exam.completeness === 'Partial') {
          status += ' ' + this.translateService.instant('common.completeness.Partial');
        }
        return status;
      }
    );
  }

  withAchievementLevel(getAssessment: (item: any) => Assessment, getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.achievement-level'),
      (item) => {
        const exam: Exam = getExam(item);
        if (!exam || !exam.level) {
          return '';
        }
        const { subject, type } = getAssessment(item);
        return this.translateService.instant(exam.level
          ? `subject.${subject}.asmt-type.${type}.level.${exam.level}.name`
          : 'common.missing'
        );
      }
    );
  }

  withAccommodationCodes(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.accommodation-codes'),
      (item) => {
        const exam: Exam = getExam(item);
        if (!exam || !exam.accommodationCodes) {
          return '';
        }
        return exam.accommodationCodes.join('|');
      }
    );
  }

  // TODO - Is this different than AchievementLevel now -- ?
  withReportingCategory(getAssessment: (item: any) => Assessment, getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-exam-columns.iab.performance'),
      (item) => {
        const exam: Exam = getExam(item);
        if (!exam || !exam.level) {
          return '';
        }
        const { subject, type } = getAssessment(item);
        return this.translateService.instant(
          `subject.${subject}.asmt-type.${type}.level.${exam.level}.name`);
      }
    );
  }

  withScaleScore(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.scale-score'),
      (item) => {
        const score = getExam(item).score;
        return score ? score : '';
      }
    );
  }

  withErrorBandMin(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.error-band-min'),
      (item) => {
        const exam: Exam = getExam(item);
        return !exam.score ? '' : exam.score - exam.standardError;
      }
    );
  }

  withErrorBandMax(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.error-band-max'),
      (item) => {
        const exam: Exam = getExam(item);
        return exam.score ? exam.score + exam.standardError : '';
      }
    );
  }

  withClaimScores(subject: string, claims: string[], getAssessment: (item: any) => Assessment, getExam: (item: any) => Exam) {
    claims.forEach((claim, index) => {
      this.withColumn(
        `${this.translateService.instant(`subject.${subject}.name`)}: ${this.translateService.instant(`subject.${subject}.claim.${claim}.name`)}`,
        (item) => {
          const exam: Exam = getExam(item);
          if (!exam || !exam.claimScores[ index ].level) {
            return '';
          }
          const assessment = getAssessment(item);
          const level = exam.claimScores[ index ].level;
          return this.translateService.instant(level
            ? `subject.${assessment.subject}.asmt-type.${assessment.type}.claim-score.level.${level}.name`
            : 'common.missing'
          );
        }
      );
    });
    return this;
  }

  withGender(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateService.instant('csv-builder.gender'),
      (item) => getStudent(item).genderCode ? this.translateService.instant(`common.gender.${getStudent(item).genderCode}`) : ''
    );
  }

  withMigrantStatus(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.migrant-status'),
      (item) => {
        const migrantStatus = getExam(item).migrantStatus;
        if (migrantStatus == null) {
          return '';
        }
        const polarEnum = migrantStatus ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  with504Plan(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.504-plan'),
      (item) => {
        const plan504 = getExam(item).plan504;
        if (plan504 == null) {
          return '';
        }
        const polarEnum = plan504 ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withIep(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.iep'),
      (item) => {
        const iep = getExam(item).iep;
        if (iep == null) {
          return '';
        }
        const polarEnum = iep ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withLimitedEnglish(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.limited-english'),
      (item) => {
        const limitedEnglishProficiency = getExam(item).limitedEnglishProficiency;
        if (limitedEnglishProficiency == null) {
          return '';
        }
        const polarEnum = limitedEnglishProficiency ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withElas(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.elas'),
      (item) => {
        const elasCode = getExam(item).elasCode;
        return elasCode ? this.translateService.instant(`common.elas.${getExam(item).elasCode}`) : '';
      }
    )
  }

  withEthnicity(getExam: (item: any) => Exam, ethnicities: string[]) {
    for (const ethnicity of ethnicities) {
      this.withColumn(
        ethnicity,
        (item) => {
          if (getExam(item).student.ethnicityCodes.some(code => code == ethnicity)) {
            return this.getPolarTranslation(1);
          } else {
            return '';
          }
        });
    }
    return this;
  }

  withItemNumber(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.number'),
      (item) => getAssessmentItem(item).position
    );
  }

  withClaim(getAssessment: (item: any) => Assessment, getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('csv-builder.claim'),
      (item) => {
        const assessment = getAssessment(item);
        const assessmentItem = getAssessmentItem(item);
        return this.translateService.instant(`subject.${assessment.subject}.claim.${assessmentItem.claim}.name`);
      }
    );
  }

  withTarget(getAssessment: (item: any) => Assessment, getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('csv-builder.target'),
      (item) => {
        const assessment = getAssessment(item);
        const assessmentItem = getAssessmentItem(item);
        return this.translateService
          .instant(`subject.${assessment.subject}.claim.${assessmentItem.claim}.target.${assessmentItem.targetNaturalId}.name`);
      }
    );
  }

  withItemDifficulty(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.difficulty'),
      (item) => this.translateService.instant(`common.difficulty.${getAssessmentItem(item).difficulty}`)
    );
  }

  withItemAnswerKey(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.answer-key'),
      (item) => getAssessmentItem(item).answerKey
    );
  }

  withStandards(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.standard'),
      (item) => getAssessmentItem(item).commonCoreStandardIds.join(', ')
    );
  }

  withFullCredit(getAssessmentItem: (item: any) => AssessmentItem,
                 showAsPercent: boolean) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.full-credit'),
      (item) => {
        const assessmentItem: AssessmentItem = getAssessmentItem(item);
        const fullCredit: number = showAsPercent ? assessmentItem.fullCreditAsPercent : assessmentItem.fullCredit;
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
          const field = showAsPercent ? column.percentField : column.numberField;
          const value: number = getAssessmentItem(item)[ field ];
          if (Utils.isNullOrUndefined(value)) {
            return '';
          }
          return this.numberAsString(value, showAsPercent);
        }
      );
    });
    return this;
  }

  withPerformanceTaskWritingType(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.purpose'),
      (item) => getAssessmentItem(item).performanceTaskWritingType
    );
  }

  withGroupName(getGroupName: (item: any) => string) {
    return this.withColumn(
      this.translateService.instant('groups.columns.group'),
      (item) => getGroupName(item)
    );
  }

  withTargetReportAggregate(subjectDefinition: SubjectDefinition,
                            getAssessment: (item: any) => Assessment,
                            getTargetReportAggregate: (item: any) => AggregateTargetScoreRow) {
    this.withColumn(
      this.translateService.instant('target-report.columns.claim'),
      (item) => {
        const assessment = getAssessment(item);
        const row = getTargetReportAggregate(item);
        return this.translateService.instant(`subject.${assessment.subject}.claim.${row.claim}.name`);
      }
    );
    this.withColumn(
      this.translateService.instant('target-report.columns.target'),
      (item) => {
        const assessment = getAssessment(item);
        const row = getTargetReportAggregate(item);
        return this.translateService.instant(`subject.${assessment.subject}.claim.${row.claim}.target.${row.targetNaturalId}.name`);
      }
    );
    this.withColumn(
      this.translateService.instant('target-report.columns.subgroup'),
      (item) => getTargetReportAggregate(item).subgroup.name
    );

    this.withColumn(
      this.translateService.instant('target-report.columns.studentsTested'),
      (item) => getTargetReportAggregate(item).studentsTested
    );

    this.withColumn(
      this.translateService.instant('target-report.columns.student-relative-residual-scores-level'),
      (item) => {
        const studentRelativeLevel = TargetReportingLevel[ getTargetReportAggregate(item).studentRelativeLevel ];
        if (studentRelativeLevel === TargetReportingLevel.NoResults) {
          return '';
        }
        return this.translateService.instant('aggregate-report-table.target.overall.' + studentRelativeLevel);
      }
    );

    const standardMetHeaderResolve: any = {
      name: this.translateService.instant(`subject.${subjectDefinition.subject}.asmt-type.${subjectDefinition.assessmentType}.level.${subjectDefinition.performanceLevelStandardCutoff}.name`),
      id: subjectDefinition.performanceLevelStandardCutoff
    };

    this.withColumn(
      this.translateService.instant('target-report.columns.standard-met-relative-residual-level', standardMetHeaderResolve),
      (item) => {
        const standardMetRelativeLevel = TargetReportingLevel[ getTargetReportAggregate(item).standardMetRelativeLevel ];
        if (standardMetRelativeLevel === TargetReportingLevel.NoResults) {
          return '';
        }
        return this.translateService.instant('aggregate-report-table.target.standard.' + standardMetRelativeLevel);
      }
    );

    return this;
  }

  withWritingTraitAggregate(getWritingTraitAggregate: (item: any) => WritingTraitAggregate,
                            maxPoints: number,
                            showAsPercent: boolean) {

    this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.category'),
      (item) => this.translateService.instant('common.writing-trait.' + getWritingTraitAggregate(item).trait.type)
    );

    this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.average'),
      (item) => this.numberPipe.transform(getWritingTraitAggregate(item).average, '1.0-1')
    );

    this.withColumn(
      this.translateService.instant('common.results.assessment-item-columns.max-points'),
      (item) => this.numberAsString(getWritingTraitAggregate(item).trait.maxPoints, false)
    );

    for (let i = 0; i <= maxPoints; i++) {
      this.withColumn(
        this.translateService.instant('common.results.assessment-item-columns.x-points', { id: i }),
        (item) => {
          const value = showAsPercent ? getWritingTraitAggregate(item).percents[ i ] : getWritingTraitAggregate(item).numbers[ i ];
          return Utils.isNullOrUndefined(value) ? '' : this.numberAsString(value, showAsPercent);
        }
      );
    }

    return this;
  }

  // Combination methods for commonly-associated columns

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
    let studentContext = this
      .withMigrantStatus(getExam)
      .with504Plan(getExam)
      .withIep(getExam);

    if (this.showLep) {
      studentContext = studentContext.withLimitedEnglish(getExam);
    }
    if (this.showElas) {
      studentContext = studentContext.withElas(getExam);
    }

    studentContext = studentContext.withEthnicity(getExam, ethnicities);
    return studentContext;
  }

  private numberAsString(value: Number, showAsPercent: boolean) {
    return this.numberPipe.transform(value, '1.0-0') +
      (showAsPercent ? '%' : '');
  }

  private getPolarTranslation(polar: number): string {
    return this.translateService.instant(`common.polar.${polar}`);
  }

}
