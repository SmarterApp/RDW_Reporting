import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CsvColumn } from './csv-column.model';
import { Student } from '../student/model/student.model';
import { Exam } from '../assessments/model/exam';
import { Assessment } from '../assessments/model/assessment';
import { Angular2CsvProvider } from './angular-csv.provider';
import { AssessmentItem } from '../assessments/model/assessment-item.model';
import { DynamicItemField } from '../assessments/model/item-point-field.model';
import { SchoolYearPipe } from '../shared/format/school-year.pipe';
import { removeHtml, Utils } from '../shared/support/support';
import { TraitCategoryAggregate } from '../assessments/model/trait-category-aggregate.model';
import { TranslateDatePipe } from '../shared/i18n/translate-date.pipe';
import { TranslateNumberPipe } from '../shared/i18n/translate-number.pipe';
import {
  AggregateTargetScoreRow,
  TargetReportingLevel
} from '../assessments/model/aggregate-target-score-row.model';
import { SubjectDefinition } from '../subject/subject';
import { Filter } from '../exam/model/filter';

@Injectable()
export class CsvBuilder {
  private columns: CsvColumn[] = [];
  private filename = 'export';

  constructor(
    private angular2csv: Angular2CsvProvider,
    private translateService: TranslateService,
    private datePipe: TranslateDatePipe,
    private schoolYearPipe: SchoolYearPipe,
    private numberPipe: TranslateNumberPipe
  ) {}

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
      this.numberPipe
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
    this.angular2csv.export(
      [
        this.columns.map(column => column.label),
        ...rows.map(row => this.columns.map(column => column.dataProvider(row)))
      ],
      this.filename
    );
  }

  /**
   * General method for adding a column to the output CSV.
   *
   * @param label           The column header label
   * @param dataProvider    The column data provider
   * @returns {CsvBuilder}  This builder
   */
  withColumn(label: string, dataProvider: (item: any) => any) {
    this.columns.push({
      label,
      dataProvider
    });
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
      item => getStudent(item).ssid
    );
  }

  withStudentName(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateService.instant('csv-builder.student-first-name'),
      item => (getStudent(item).firstName ? getStudent(item).firstName : '')
    ).withColumn(
      this.translateService.instant('csv-builder.student-last-name'),
      item => (getStudent(item).lastName ? getStudent(item).lastName : '')
    );
  }

  withExamDate(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.submit-date-time'),
      item => this.datePipe.transform(getExam(item).date)
    );
  }

  withExamSession(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.assessment-session-id'),
      item => {
        const session = getExam(item).session;
        return session ? session : '';
      }
    );
  }

  withSchool(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.school'),
      item => getExam(item).school.name
    );
  }

  withSchoolYear(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.school-year'),
      item => this.schoolYearPipe.transform(getExam(item).schoolYear)
    );
  }

  withAssessmentType(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('csv-builder.assessment-type'),
      item => {
        const assessment: Assessment = getAssessment(item);
        return this.translateService.instant(
          `subject.${assessment.subject}.asmt-type.${assessment.type}.name`
        );
      }
    );
  }

  withAssessmentName(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('csv-builder.assessment-name'),
      item => getAssessment(item).label
    );
  }

  withAssessmentSubject(getAssessment: (item: any) => Assessment) {
    return this.withColumn(
      this.translateService.instant('csv-builder.subject'),
      item =>
        this.translateService.instant(
          `subject.${getAssessment(item).subject}.name`
        )
    );
  }

  withExamGrade(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.enrolled-grade'),
      item => {
        const gradeCode: string = getExam(item).enrolledGrade;
        return this.translateService.instant(
          `common.enrolled-grade-label.${gradeCode}`
        );
      }
    );
  }

  // TODO - Split out -- ?
  withExamStatus(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant(
        'common.results.assessment-exam-columns.status'
      ),
      item => {
        const exam: Exam = getExam(item);
        const adminCondition: string = exam.administrativeCondition;
        let status: string = adminCondition
          ? this.translateService.instant(
              `common.administration-condition.${adminCondition}`
            )
          : '';
        if (exam.completeness === 'Partial') {
          status +=
            ' ' + this.translateService.instant('common.completeness.Partial');
        }
        return status;
      }
    );
  }

  withAchievementLevel(
    getAssessment: (item: any) => Assessment,
    getExam: (item: any) => Exam
  ) {
    return this.withColumn(
      this.translateService.instant('csv-builder.achievement-level'),
      item => {
        const exam: Exam = getExam(item);
        if (!exam || !exam.level) {
          return '';
        }
        const { subject, type } = getAssessment(item);
        return this.translateService.instant(
          exam.level
            ? `subject.${subject}.asmt-type.${type}.level.${exam.level}.name`
            : 'common.missing'
        );
      }
    );
  }

  withAccommodationCodes(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.accommodation-codes'),
      item => {
        const exam: Exam = getExam(item);
        if (!exam || !exam.accommodationCodes) {
          return '';
        }
        return exam.accommodationCodes.join('|');
      }
    );
  }

  // TODO - Is this different than AchievementLevel now -- ?
  withReportingCategory(
    getAssessment: (item: any) => Assessment,
    getExam: (item: any) => Exam
  ) {
    return this.withColumn(
      this.translateService.instant(
        'common.results.assessment-exam-columns.iab.performance'
      ),
      item => {
        const exam: Exam = getExam(item);
        if (!exam || !exam.level) {
          return '';
        }
        const { subject, type } = getAssessment(item);
        return this.translateService.instant(
          `subject.${subject}.asmt-type.${type}.level.${exam.level}.name`
        );
      }
    );
  }

  withScaleScore(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.scale-score'),
      item => {
        const score = getExam(item).score;
        return score ? score : '';
      }
    );
  }

  withErrorBandMin(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.error-band-min'),
      item => {
        const exam: Exam = getExam(item);
        return exam.score && exam.standardError != null
          ? exam.score - exam.standardError
          : '';
      }
    );
  }

  withErrorBandMax(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.error-band-max'),
      item => {
        const exam: Exam = getExam(item);
        return exam.score && exam.standardError != null
          ? exam.score + exam.standardError
          : '';
      }
    );
  }

  withAlternateScores(
    subject: string,
    scoreCodes: string[],
    getAssessment: (item: any) => Assessment,
    getExam: (item: any) => Exam
  ) {
    const subjectName = this.translateService.instant(
      `subject.${subject}.name`
    );

    scoreCodes.forEach((scoreCode, index) => {
      const name = this.translateService.instant(
        `subject.${subject}.alt.${scoreCode}.name`
      );

      this.withColumn(
        `${subjectName}: ${removeHtml(
          this.translateService.instant(
            'common.results.assessment-exam-columns.alternateScaleScoreLevel',
            { name }
          )
        )}`,
        item => {
          const exam: Exam = getExam(item);
          if (!exam || !exam.alternateScaleScores[index].level) {
            return '';
          }
          const assessment = getAssessment(item);
          const level = exam.alternateScaleScores[index].level;
          return this.translateService.instant(
            level
              ? `subject.${assessment.subject}.asmt-type.${
                  assessment.type
                }.alt-score.level.${level}.name`
              : 'common.missing'
          );
        }
      )
        .withColumn(
          `${subjectName}: ${this.translateService.instant(
            'common.results.assessment-exam-columns.alternateScaleScore',
            { name }
          )}`,
          item => {
            const exam: Exam = getExam(item);
            if (!exam || !exam.alternateScaleScores[index].score) {
              return '';
            }
            return exam.alternateScaleScores[index].score;
          }
        )
        .withColumn(
          `${subjectName}: ${this.translateService.instant(
            'common.results.assessment-exam-columns.alternateScaleScoreStandardError',
            { name }
          )}`,
          item => {
            const exam: Exam = getExam(item);
            if (!exam || !exam.alternateScaleScores[index].score) {
              return '';
            }
            return exam.alternateScaleScores[index].standardError;
          }
        );
    });
    return this;
  }

  withClaimScores(
    subject: string,
    scoreCodes: string[],
    getAssessment: (item: any) => Assessment,
    getExam: (item: any) => Exam
  ) {
    scoreCodes.forEach((scoreCode, index) => {
      this.withColumn(
        `${this.translateService.instant(
          `subject.${subject}.name`
        )}: ${this.translateService.instant(
          `subject.${subject}.claim.${scoreCode}.name`
        )}`,
        item => {
          const exam: Exam = getExam(item);
          if (!exam || !exam.claimScaleScores[index].level) {
            return '';
          }
          const assessment = getAssessment(item);
          const level = exam.claimScaleScores[index].level;
          return this.translateService.instant(
            level
              ? `subject.${assessment.subject}.asmt-type.${
                  assessment.type
                }.claim-score.level.${level}.name`
              : 'common.missing'
          );
        }
      );
    });
    return this;
  }

  withEconomicDisadvantage(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.EconomicDisadvantage'),
      item => {
        const polarEnum = getExam(item).economicDisadvantage ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withGender(getStudent: (item: any) => Student) {
    return this.withColumn(
      this.translateService.instant('csv-builder.gender'),
      item =>
        getStudent(item).genderCode
          ? this.translateService.instant(
              `common.gender.${getStudent(item).genderCode}`
            )
          : ''
    );
  }

  withMigrantStatus(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.migrant-status'),
      item => {
        const migrantStatus = getExam(item).migrantStatus;
        if (migrantStatus == null) {
          return '';
        }
        const polarEnum = migrantStatus ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withSection504(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.504-plan'),
      item => {
        const plan504 = getExam(item).plan504;
        if (plan504 == null) {
          return '';
        }
        const polarEnum = plan504 ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withIndividualEducationPlan(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.iep'),
      item => {
        const iep = getExam(item).iep;
        if (iep == null) {
          return '';
        }
        const polarEnum = iep ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withLimitedEnglishProficiency(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.limited-english'),
      item => {
        const limitedEnglishProficiency = getExam(item)
          .limitedEnglishProficiency;
        if (limitedEnglishProficiency == null) {
          return '';
        }
        const polarEnum = limitedEnglishProficiency ? 1 : 2;
        return this.getPolarTranslation(polarEnum);
      }
    );
  }

  withEnglishLanguageAcquisitionStatus(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.elas'),
      item => {
        const elasCode = getExam(item).elasCode;
        return elasCode
          ? this.translateService.instant(
              `common.elas.${getExam(item).elasCode}`
            )
          : '';
      }
    );
  }

  withPrimaryLanguage(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.language'),
      item => {
        const languageCode = getExam(item).languageCode;
        return languageCode
          ? this.translateService.instant(
              `common.languages.${getExam(item).languageCode}`
            )
          : '';
      }
    );
  }

  withPrimaryLanguageCode(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.language-code'),
      item => {
        const languageCode = getExam(item).languageCode;
        return languageCode ? languageCode : '';
      }
    );
  }

  withMilitaryStudentIdentifier(getExam: (item: any) => Exam) {
    return this.withColumn(
      this.translateService.instant('csv-builder.military-connected-code'),
      item => {
        const militaryConnectedCode = getExam(item).militaryConnectedCode;
        return militaryConnectedCode
          ? this.translateService.instant(
              `common.military-connected-code.${
                getExam(item).militaryConnectedCode
              }`
            )
          : '';
      }
    );
  }

  withEthnicity(getExam: (item: any) => Exam, ethnicities: string[]) {
    for (const ethnicity of ethnicities) {
      this.withColumn(ethnicity, item => {
        if (
          getExam(item).student.ethnicityCodes.some(code => code === ethnicity)
        ) {
          return this.getPolarTranslation(1);
        }
        return '';
      });
    }
    return this;
  }

  withItemNumber(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.number'
      ),
      item => getAssessmentItem(item).position
    );
  }

  withClaim(
    getAssessment: (item: any) => Assessment,
    getAssessmentItem: (item: any) => AssessmentItem
  ) {
    return this.withColumn(
      this.translateService.instant('csv-builder.claim'),
      item => {
        const assessment = getAssessment(item);
        const assessmentItem = getAssessmentItem(item);
        return this.translateService.instant(
          `subject.${assessment.subject}.claim.${assessmentItem.claim}.name`
        );
      }
    );
  }

  withTarget(
    getAssessment: (item: any) => Assessment,
    getAssessmentItem: (item: any) => AssessmentItem
  ) {
    return this.withColumn(
      this.translateService.instant('csv-builder.target'),
      item => {
        const assessment = getAssessment(item);
        const assessmentItem = getAssessmentItem(item);
        return this.translateService.instant(
          `subject.${assessment.subject}.claim.${assessmentItem.claim}.target.${
            assessmentItem.targetNaturalId
          }.name`
        );
      }
    );
  }

  withItemDifficulty(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.difficulty'
      ),
      item =>
        this.translateService.instant(
          `common.difficulty.${getAssessmentItem(item).difficulty}`
        )
    );
  }

  withItemAnswerKey(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.answer-key'
      ),
      item => getAssessmentItem(item).answerKey
    );
  }

  withStandards(getAssessmentItem: (item: any) => AssessmentItem) {
    return this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.standard'
      ),
      item => getAssessmentItem(item).commonCoreStandardIds.join(', ')
    );
  }

  withFullCredit(
    getAssessmentItem: (item: any) => AssessmentItem,
    showAsPercent: boolean
  ) {
    return this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.full-credit'
      ),
      item => {
        const assessmentItem: AssessmentItem = getAssessmentItem(item);
        const fullCredit: number = showAsPercent
          ? assessmentItem.fullCreditAsPercent
          : assessmentItem.fullCredit;
        return this.numberAsString(fullCredit, showAsPercent);
      }
    );
  }

  withPoints(
    getAssessmentItem: (item: any) => AssessmentItem,
    pointColumns: DynamicItemField[],
    showAsPercent: boolean
  ) {
    pointColumns.forEach(column => {
      this.withColumn(column.label, item => {
        const field = showAsPercent ? column.percentField : column.numberField;
        const value: number = getAssessmentItem(item)[field];
        if (Utils.isNullOrUndefined(value)) {
          return '';
        }
        return this.numberAsString(value, showAsPercent);
      });
    });
    return this;
  }

  withGroupName(getGroupName: (item: any) => string) {
    return this.withColumn(
      this.translateService.instant('groups.columns.group'),
      item => getGroupName(item)
    );
  }

  withTargetReportAggregate(
    subjectDefinition: SubjectDefinition,
    getAssessment: (item: any) => Assessment,
    getTargetReportAggregate: (item: any) => AggregateTargetScoreRow
  ) {
    this.withColumn(
      this.translateService.instant('target-report.columns.claim'),
      item => {
        const assessment = getAssessment(item);
        const row = getTargetReportAggregate(item);
        return this.translateService.instant(
          `subject.${assessment.subject}.claim.${row.claim}.name`
        );
      }
    );
    this.withColumn(
      this.translateService.instant('target-report.columns.target'),
      item => {
        const assessment = getAssessment(item);
        const row = getTargetReportAggregate(item);
        return this.translateService.instant(
          `subject.${assessment.subject}.claim.${row.claim}.target.${
            row.targetNaturalId
          }.name`
        );
      }
    );
    this.withColumn(
      this.translateService.instant('target-report.columns.subgroup'),
      item => getTargetReportAggregate(item).subgroup.name
    );

    this.withColumn(
      this.translateService.instant('target-report.columns.studentsTested'),
      item => getTargetReportAggregate(item).studentsTested
    );

    this.withColumn(
      this.translateService.instant(
        'target-report.columns.student-relative-residual-scores-level'
      ),
      item => {
        const studentRelativeLevel =
          TargetReportingLevel[
            getTargetReportAggregate(item).studentRelativeLevel
          ];
        if (studentRelativeLevel === TargetReportingLevel.NoResults) {
          return '';
        }
        return this.translateService.instant(
          'aggregate-report-table.target.overall.' + studentRelativeLevel
        );
      }
    );

    const standardMetHeaderResolve: any = {
      name: this.translateService.instant(
        `subject.${subjectDefinition.subject}.asmt-type.${
          subjectDefinition.assessmentType
        }.level.${subjectDefinition.performanceLevelStandardCutoff}.name`
      ),
      id: subjectDefinition.performanceLevelStandardCutoff
    };

    this.withColumn(
      this.translateService.instant(
        'target-report.columns.standard-met-relative-residual-level',
        standardMetHeaderResolve
      ),
      item => {
        const standardMetRelativeLevel =
          TargetReportingLevel[
            getTargetReportAggregate(item).standardMetRelativeLevel
          ];
        if (standardMetRelativeLevel === TargetReportingLevel.NoResults) {
          return '';
        }
        return this.translateService.instant(
          'aggregate-report-table.target.standard.' + standardMetRelativeLevel
        );
      }
    );

    return this;
  }

  /**
   * Emit trait columns: purpose, category, avg/max points, and counts per point.
   * Note: translation keys for purpose and category are different for interims
   * and summatives: for interims use the legacy hard-coded keys; for summatives
   * use the newer subject-specific trait keys.
   *
   * This is a larger-than-typical csv-builder method. It could be broken up a bit
   * but then there would be 2-5 methods with similar arguments.
   *
   * @param subject                    subject code, e.g. ELA
   * @param isSummative                true if this assessment is summative
   * @param getPurpose                 functor to get purpose from row
   * @param getTraitCategoryAggregate  functor to get category aggregate from row
   * @param maxPoints                  max points across all rows
   * @param showAsPercent              to show percent, false to show counts
   */
  withCategoryTraitAggregate(
    subject: string,
    isSummative: boolean,
    getPurpose: (item: any) => string,
    getTraitCategoryAggregate: (item: any) => TraitCategoryAggregate,
    maxPoints: number,
    showAsPercent: boolean
  ) {
    this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.purpose'
      ),
      item => {
        const purpose = getPurpose(item);
        return isSummative
          ? this.translateService.instant(
              'subject.' + subject + '.trait.purpose.' + purpose + '.name'
            )
          : purpose;
      }
    );

    this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.category'
      ),
      item => {
        const category = getTraitCategoryAggregate(item).trait.type;
        return this.translateService.instant(
          isSummative
            ? 'subject.' + subject + '.trait.category.' + category + '.name'
            : 'common.writing-trait.' + category
        );
      }
    );

    this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.average'
      ),
      item =>
        this.numberPipe.transform(
          getTraitCategoryAggregate(item).average,
          '1.0-1'
        )
    );

    this.withColumn(
      this.translateService.instant(
        'common.results.assessment-item-columns.max-points'
      ),
      item =>
        this.numberAsString(
          getTraitCategoryAggregate(item).trait.maxPoints,
          false
        )
    );

    for (let i = 0; i <= maxPoints; i++) {
      this.withColumn(
        this.translateService.instant(
          'common.results.assessment-item-columns.x-points',
          { id: i }
        ),
        item => {
          const value = showAsPercent
            ? getTraitCategoryAggregate(item).percents[i]
            : getTraitCategoryAggregate(item).numbers[i];
          return value == null ? '' : this.numberAsString(value, showAsPercent);
        }
      );
    }

    return this;
  }

  // Combination methods for commonly-associated columns

  withStudent(getStudent: (item: any) => Student) {
    return this.withStudentId(getStudent).withStudentName(getStudent);
  }

  withScoreAndErrorBand(getExam: (item: any) => Exam) {
    return this.withScaleScore(getExam)
      .withErrorBandMin(getExam)
      .withErrorBandMax(getExam);
  }

  withAssessmentTypeNameAndSubject(getAssessment: (item: any) => Assessment) {
    return this.withAssessmentType(getAssessment)
      .withAssessmentName(getAssessment)
      .withAssessmentSubject(getAssessment);
  }

  withExamGradeAndStatus(getExam: (item: any) => Exam) {
    return this.withExamGrade(getExam).withExamStatus(getExam);
  }

  withExamDateAndSession(getExam: (item: any) => Exam) {
    return this.withExamDate(getExam).withExamSession(getExam);
  }

  withStudentContext(
    getExam: (item: any) => Exam,
    getStudent: (item: any) => Student,
    studentFilters: Filter[]
  ) {
    const genderFilter = studentFilters.find(({ id }) => id === 'Gender');
    if (genderFilter != null) {
      this.withGender(getStudent);
    }

    const migrantStatusFilter = studentFilters.find(
      ({ id }) => id === 'MigrantStatus'
    );
    if (migrantStatusFilter != null) {
      this.withMigrantStatus(getExam);
    }

    const section504Filter = studentFilters.find(
      ({ id }) => id === 'Section504'
    );
    if (section504Filter != null) {
      this.withSection504(getExam);
    }

    const iepFilter = studentFilters.find(
      ({ id }) => id === 'IndividualEducationPlan'
    );
    if (iepFilter != null) {
      this.withIndividualEducationPlan(getExam);
    }

    const economicDisadvantageFilter = studentFilters.find(
      ({ id }) => id === 'EconomicDisadvantage'
    );
    if (economicDisadvantageFilter != null) {
      this.withEconomicDisadvantage(getExam);
    }

    const limitedEnglishFilter = studentFilters.find(
      ({ id }) => id === 'LimitedEnglishProficiency'
    );
    if (limitedEnglishFilter != null) {
      this.withLimitedEnglishProficiency(getExam);
    }

    const englishLearnersFilter = studentFilters.find(
      ({ id }) => id === 'EnglishLanguageAcquisitionStatus'
    );
    if (englishLearnersFilter != null) {
      this.withEnglishLanguageAcquisitionStatus(getExam);
    }

    const primaryLanguageFilter = studentFilters.find(
      ({ id }) => id === 'PrimaryLanguage'
    );
    if (primaryLanguageFilter != null) {
      this.withPrimaryLanguage(getExam);
    }

    const militaryStudentIdentifierFilter = studentFilters.find(
      ({ id }) => id === 'MilitaryStudentIdentifier'
    );
    if (militaryStudentIdentifierFilter != null) {
      this.withMilitaryStudentIdentifier(getExam);
    }

    const ethnicityFilter = studentFilters.find(({ id }) => id === 'Ethnicity');
    if (ethnicityFilter != null) {
      this.withEthnicity(getExam, ethnicityFilter.values);
    }

    return this;
  }

  private numberAsString(value: Number, showAsPercent: boolean) {
    return (
      this.numberPipe.transform(value, '1.0-0') + (showAsPercent ? '%' : '')
    );
  }

  private getPolarTranslation(polar: number): string {
    return this.translateService.instant(`common.polar.${polar}`);
  }
}
