import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AssessmentItem,
  fullCreditItemCount,
  fullCreditItemPercent
} from '../../../model/assessment-item.model';
import { Exam } from '../../../model/exam';
import { ExamStatisticsCalculator } from '../../exam-statistics-calculator';
import { AssessmentProvider } from '../../../assessment-provider.interface';
import { Assessment } from '../../../model/assessment';
import { TraitScoreSummary } from '../../../model/trait-score-summary.model';
import { AssessmentExporter } from '../../../assessment-exporter.interface';
import { RequestType } from '../../../../shared/enum/request-type.enum';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { flatMap, map, share, shareReplay, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { first } from 'rxjs/internal/operators/first';
import { tap } from 'rxjs/internal/operators/tap';
import { sum } from '../../../../exam/model/score-statistics';
import { ExportWritingTraitsRequest } from '../../../model/export-writing-trait-request.model';
import { ExportResults } from '../export-results';
import { StudentResponsesAssessmentItem } from '../../../model/student-responses-item.model';
import { TranslateService } from '@ngx-translate/core';
import WritingTraitUtils from '../../../model/writing-trait-utils';

interface ItemView {
  item: AssessmentItem;
  responsesAssessmentItem?: StudentResponsesAssessmentItem;
  fullCreditCount: number;
  fullCreditPercent: number;
}

// used to supplement the data for the WER item
// (used only for interims that derive trait scores from item-level data)
interface WritingTraitInfo {
  purpose: string;
  categories: string[];
}

class Column {
  id: string;
  field: string;
  sortField: string;
  headerInfo: boolean;
  styleClass: string;
  sortable: boolean;

  // Writing trait item column properties
  index?: number;

  constructor({
    id,
    field = '',
    sortField = '',
    headerInfo = false,
    styleClass = '',
    sortable = true,
    index = -1
  }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : this.field;
    this.headerInfo = headerInfo;
    this.styleClass = styleClass;
    this.sortable = sortable;
    if (index >= 0) {
      this.index = index;
    }
  }
}

function toTraitSummaryColumns(summary: TraitScoreSummary): Column[] {
  const columns = [];
  for (let i = 0; i < summary.maxNumbers; ++i) {
    columns.push(
      new Column({
        id: 'item-point',
        index: i,
        styleClass: i === 0 ? 'level-down' : '',
        sortable: false
      })
    );
  }
  return columns;
}

@Component({
  selector: 'writing-trait-scores',
  templateUrl: './writing-trait-scores.component.html'
})
export class WritingTraitScoresComponent
  implements OnInit, OnDestroy, ExportResults {
  readonly totalType: string = WritingTraitUtils.total().type;

  readonly writingTraitColumns: Column[] = [
    new Column({ id: 'number', field: 'position' }),
    new Column({ id: 'claim', field: 'claimTarget', headerInfo: true }),
    new Column({
      id: 'purpose',
      field: 'writingTraitType',
      headerInfo: true
    }),
    new Column({
      id: 'difficulty',
      sortField: 'difficultySortOrder',
      headerInfo: true
    }),
    new Column({
      id: 'standard',
      field: 'commonCoreStandardIds',
      headerInfo: true
    }),
    new Column({
      id: 'full-credit',
      field: 'fullCredit',
      headerInfo: true
    })
  ];

  /**
   * If true, values will be shown as percentages
   */
  @Input()
  showValuesAsPercent: boolean;

  /**
   * Service class which provides export capabilities=for this assessment and exam.
   */
  @Input()
  assessmentExporter: AssessmentExporter;

  /**
   * The assessment
   */
  @Input()
  set assessment(value: Assessment) {
    this.assessment$.next(value);
  }

  /**
   * Service class which provides assessment data for this assessment and exam.
   */
  @Input()
  set assessmentProvider(value: AssessmentProvider) {
    this.assessmentProvider$.next(value);
  }

  /**
   * The exams to show items for.
   */
  @Input()
  set exams(value: Exam[]) {
    this.exams$.next(value);
  }

  items$: Observable<AssessmentItem[]>;
  itemViews$: Observable<ItemView[]>;
  hasWritingTraitItems$: Observable<boolean>;
  traitScoreSummaries$: Observable<Map<string, TraitScoreSummary>[]>;
  writingTraitInfo$: Observable<WritingTraitInfo>;
  summaryColumnsBySummary$: Observable<
    Map<string, Map<TraitScoreSummary, Column[]>>
  >;
  exportRequest$: Observable<ExportWritingTraitsRequest>;
  initialized$: Observable<boolean>;
  assessment$: Subject<Assessment> = new BehaviorSubject(undefined);
  exams$: Subject<Exam[]> = new BehaviorSubject(undefined);
  private assessmentProvider$: Subject<
    AssessmentProvider
  > = new BehaviorSubject(undefined);
  private destroyed$: Subject<void> = new Subject();
  private _hasDataToExport: boolean;

  constructor(
    private translate: TranslateService,
    private examCalculator: ExamStatisticsCalculator
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    // this.assessment$.subscribe(val => console.log(val));

    this.items$ = combineLatest(
      this.assessment$,
      this.assessmentProvider$
    ).pipe(
      takeUntil(this.destroyed$),
      flatMap(([assessment, provider]) =>
        provider.getAssessmentItems(assessment.id, ['WER'])
      ),
      share()
    );

    this.hasWritingTraitItems$ = this.items$.pipe(
      map(items => items.length > 0)
    );

    // create supplementary writing trait info (for interims only)
    this.writingTraitInfo$ = combineLatest(this.assessment$, this.items$).pipe(
      takeUntil(this.destroyed$),
      map(([assessment, items]) =>
        assessment.type === 'sum' || items.length === 0
          ? undefined
          : {
              // yes, these are just hard-coded
              categories: ['evidence', 'organization', 'conventions', 'total'],
              purpose: items[0].performanceTaskWritingType
            }
      ),
      share()
    );

    this.itemViews$ = combineLatest(this.items$, this.exams$).pipe(
      takeUntil(this.destroyed$),
      map(([items, exams]) =>
        items.map(item => ({
          item: Object.assign(item, {
            scores: item.scores.filter(score =>
              exams.some(exam => exam.id === score.examId)
            )
          }),
          // TODO Uncomment to enable the writing trait tab
          // responsesAssessmentItem: toStudentResponsesAssessmentItem(item),
          fullCreditCount: fullCreditItemCount(item.scores, item.maxPoints),
          fullCreditPercent: fullCreditItemPercent(item.scores, item.maxPoints)
        }))
      ),
      tap(items => {
        this._hasDataToExport = items.length > 0;
      }),
      shareReplay(1)
    );

    // traitScoreSummaries is an array of maps of {purpose -> TraitScoreSummary}. It is
    // an array, but the system might misbehave if there is more than one entry.
    // For summatives, this is derived from exam-level trait scores, and there will
    // always be exactly one summary in the array.
    // For interims it comes from item-level data, and, since they can technically be
    // more than one WER item in an assessment, the array could have more than one entry.
    this.traitScoreSummaries$ = combineLatest(
      this.assessment$,
      this.itemViews$,
      this.exams$
    ).pipe(
      takeUntil(this.destroyed$),
      map(([assessment, items, exams]) => {
        return assessment.type === 'sum'
          ? this.examCalculator.aggregateExamTraitScores(exams)
          : this.examCalculator.aggregateWritingTraitScores(
              items.map(({ item }) => item)
            );
      }),
      shareReplay(1)
    );

    this.summaryColumnsBySummary$ = combineLatest(
      this.traitScoreSummaries$
    ).pipe(
      takeUntil(this.destroyed$),
      map(
        ([summaries]) => <any>new Map(
            summaries.map(summary => {
              if (summary.size === 0) {
                return [];
              }
              return <any>[
                summary,
                [
                  new Column({ id: 'category', sortable: false }),
                  new Column({
                    id: 'average-max',
                    sortable: false,
                    styleClass: 'level-up'
                  }),
                  ...toTraitSummaryColumns(summary.values().next().value)
                ]
              ];
            })
          )
      )
    );

    this.exportRequest$ = combineLatest(
      this.assessment$,
      this.itemViews$.pipe(map(items => items.map(({ item }) => item))),
      this.traitScoreSummaries$
    ).pipe(
      takeUntil(this.destroyed$),
      map(([assessment, assessmentItems, summaries]) => {
        return {
          assessment,
          assessmentItems,
          summaries: summaries,
          showAsPercent: this.showValuesAsPercent,
          type: RequestType.WritingTraitScores
        };
      })
    );

    this.initialized$ = combineLatest(
      this.assessment$,
      this.exams$,
      this.assessmentProvider$
    ).pipe(
      takeUntil(this.destroyed$),
      map(values => values.every(value => value != null))
    );
  }

  hasDataToExport(): boolean {
    return this._hasDataToExport;
  }

  exportToCsv(): void {
    this.exportRequest$.pipe(first()).subscribe(request => {
      this.assessmentExporter.exportWritingTraitScoresToCsv(request);
    });
  }

  purposes(traitScoreSummary: Map<string, any>) {
    return Array.from(traitScoreSummary.keys());
  }

  getNameForPurpose(subjectCode: string, purposeCode: string) {
    return this.translate.instant(
      'subject.' + subjectCode + '.trait.purpose.' + purposeCode + '.name'
    );
  }

  getDescriptionForPurpose(subjectCode: string, purposeCode: string) {
    const key =
      'subject.' +
      subjectCode +
      '.trait.purpose.' +
      purposeCode +
      '.description';
    let description = this.translate.instant(key);
    if (description === key) {
      const name = this.getNameForPurpose(subjectCode, purposeCode);
      description = this.translate.instant(
        'common.writing-trait.default-purpose-description',
        { name: name }
      );
    }
    return description;
  }
}
