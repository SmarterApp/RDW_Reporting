import { CsvExportService } from './csv-export.service';
import { CsvBuilder } from './csv-builder.service';
import { SubjectService } from '../subject/subject.service';
import { ExamSearchFilterService } from '../exam/service/exam-search-filter.service';
import { ReportingEmbargoService } from '../shared/embargo/reporting-embargo.service';
import { of } from 'rxjs/internal/observable/of';
import { Assessment } from '../assessments/model/assessment';
import { Exam } from '../assessments/model/exam';
import { AssessmentExam } from '../assessments/model/assessment-exam.model';
import { StudentHistoryExamWrapper } from '../student/model/student-history-exam-wrapper.model';
import { Student } from '../student/model/student.model';
import { ExportItemsRequest } from '../assessments/model/export-items-request.model';
import { ExportWritingTraitsRequest } from '../assessments/model/export-writing-trait-request.model';
import { ExportTargetReportRequest } from '../assessments/model/export-target-report-request.model';
import { TraitScoreSummary } from '../assessments/model/trait-score-summary.model';
import { AssessmentItem } from '../assessments/model/assessment-item.model';
import { RequestType } from '../shared/enum/request-type.enum';
import { TraitCategoryInfo } from '../assessments/model/trait-category-info.model';
import { TraitCategoryAggregate } from '../assessments/model/trait-category-aggregate.model';

function mockitoStyleSpy<T>(prototype: any): T {
  return jasmine.createSpyObj(
    prototype.constructor.name,
    Object.entries(prototype)
      .filter(([, value]) => typeof value === 'function')
      .map(([key]) => key)
  );
}

function spyOnBuilderMethods<T extends any>(
  prototype: any,
  instance: T,
  builderMethodPrefix: string
): void {
  Object.entries(prototype)
    .filter(
      ([key, value]) =>
        typeof value === 'function' && key.startsWith(builderMethodPrefix)
    )
    .forEach(([key]) => {
      spyOn(instance, key).and.returnValue(instance);
    });
}

function buildSampleRequest(interim = false) {
  const purpose = 'test';
  const trait: TraitCategoryInfo = { type: 'trait', maxPoints: 100 };
  const scoreSummary = interim
    ? TraitScoreSummary.InterimTraitScoreSummary()
    : TraitScoreSummary.of([trait]);

  const summaries: Map<string, TraitScoreSummary>[] = [
    new Map([[purpose, scoreSummary]])
  ];

  const request: ExportWritingTraitsRequest = {
    assessment: <Assessment>{ type: interim ? 'ica' : 'sum', schoolYear: 1000 },
    type: RequestType.WritingTraitScores,
    assessmentItems: [<AssessmentItem>{ id: 1 }],
    summaries: summaries,
    showAsPercent: true
  };

  return { trait, request };
}

// TODO refactor csv export service and separate out filtering logic so it can be tested independently
describe('CsvExportService', () => {
  const csvBuilder: CsvBuilder = new CsvBuilder(null, null, null, null, null);
  const subjectService: SubjectService = new SubjectService(null);
  const examSearchFilterService: ExamSearchFilterService = new ExamSearchFilterService(
    null
  );
  const embargoService: ReportingEmbargoService = new ReportingEmbargoService(
    null,
    null,
    null
  );
  let service: CsvExportService;

  const assessmentExams: AssessmentExam[] = [
    {
      assessment: <Assessment>{
        type: 'sum',
        schoolYear: 1000
      },
      exams: <Exam[]>[{}]
    },
    {
      assessment: <Assessment>{
        type: 'ica',
        schoolYear: 1000
      },
      exams: <Exam[]>[{}]
    }
  ];

  beforeEach(() => {
    spyOn(subjectService, 'getSubjectCodes').and.returnValue(of(['subjectA']));
    spyOn(subjectService, 'getSubjectDefinitions').and.returnValue(of([]));
    spyOn(examSearchFilterService, 'getExamSearchFilters').and.returnValue(
      of({})
    );

    spyOn(csvBuilder, 'newBuilder').and.returnValue(csvBuilder);
    spyOnBuilderMethods(CsvBuilder.prototype, csvBuilder, 'with');
    spyOn(csvBuilder, 'build');

    service = new CsvExportService(
      csvBuilder,
      subjectService,
      examSearchFilterService,
      embargoService
    );
  });

  it('exportAssessmentExams should not filter out embargoed results when flag is not set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: false,
        schoolYear: 1000
      })
    );

    service.exportAssessmentExams(assessmentExams, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith([
      {
        assessment: <Assessment>{ type: 'sum', schoolYear: 1000 },
        exam: <Exam>{}
      },
      {
        assessment: <Assessment>{ type: 'ica', schoolYear: 1000 },
        exam: <Exam>{}
      }
    ]);
  });

  it('exportAssessmentExams should filter out embargoed results when flag is set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    service.exportAssessmentExams(assessmentExams, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith([
      {
        assessment: <Assessment>{ type: 'ica', schoolYear: 1000 },
        exam: <Exam>{}
      }
    ]);
  });

  it('exportStudentHistory should not filter out embargoed results when flag is not set', () => {
    const history = <StudentHistoryExamWrapper[]>[
      {
        assessment: <Assessment>{ type: 'sum', schoolYear: 1000 },
        exam: <Exam>{}
      },
      {
        assessment: <Assessment>{ type: 'ica', schoolYear: 1000 },
        exam: <Exam>{}
      }
    ];

    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: false,
        schoolYear: 1000
      })
    );

    service.exportStudentHistory(history, () => <Student>{}, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith(history);
  });

  it('exportStudentHistory should filter out embargoed results when flag is set', () => {
    const history = <StudentHistoryExamWrapper[]>[
      {
        assessment: <Assessment>{ type: 'sum', schoolYear: 1000 },
        exam: <Exam>{}
      },
      {
        assessment: <Assessment>{ type: 'ica', schoolYear: 1000 },
        exam: <Exam>{}
      }
    ];

    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    service.exportStudentHistory(history, () => <Student>{}, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith([history[1]]);
  });

  it('exportResultItems should not filter out embargoed results when flag is not set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: false,
        schoolYear: 1000
      })
    );

    service.exportResultItems(
      <ExportItemsRequest>{
        assessment: <Assessment>{ type: 'sum', schoolYear: 1000 },
        assessmentItems: [{ id: 1 }]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('exportResultItems should filter out embargoed results when flag is set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    service.exportResultItems(
      <ExportItemsRequest>{
        assessment: <Assessment>{ type: 'sum', schoolYear: 1000 }
      },
      'name'
    );

    expect(csvBuilder.build).not.toHaveBeenCalled();
  });

  it('exportResultItems should not consider embargo for non-summative requests', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    service.exportResultItems(
      <ExportItemsRequest>{
        assessment: <Assessment>{ type: 'ica', schoolYear: 1000 },
        assessmentItems: [{ id: 1 }]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('exportWritingTraitScores should not filter out embargoed results when flag is not set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: false,
        schoolYear: 1000
      })
    );

    const { trait, request } = buildSampleRequest();
    service.exportWritingTraitScores(request, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith([
      {
        assessmentItem: <AssessmentItem>{ id: 1 },
        purpose: 'test',
        writingTraitAggregate: new TraitCategoryAggregate(trait)
      }
    ]);
  });

  it('exportWritingTraitScores should filter out embargoed results when flag is set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    const { trait, request } = buildSampleRequest();
    service.exportWritingTraitScores(request, 'name');

    expect(csvBuilder.build).not.toHaveBeenCalled();
  });

  it('exportWritingTraitScores should not consider embargo for non-summative requests', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    const { trait, request } = buildSampleRequest(true);
    service.exportWritingTraitScores(request, 'name');

    expect(csvBuilder.build).toHaveBeenCalled();
  });

  it('exportTargetScoresToCsv should not filter out embargoed results when flag is not set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: false,
        schoolYear: 1000
      })
    );

    service.exportTargetScoresToCsv(
      <ExportTargetReportRequest>{
        assessment: <Assessment>{ type: 'sum', schoolYear: 1000 },
        targetScoreRows: [{}]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{}]);
  });

  it('exportTargetScoresToCsv should filter out embargoed results when flag is set', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    service.exportTargetScoresToCsv(
      <ExportTargetReportRequest>{
        assessment: <Assessment>{ type: 'sum', schoolYear: 1000 },
        targetScoreRows: [{}]
      },
      'name'
    );

    expect(csvBuilder.build).not.toHaveBeenCalled();
  });

  it('exportTargetScoresToCsv should not consider embargo for non-summative requests', () => {
    spyOn(embargoService, 'getEmbargo').and.returnValue(
      of({
        enabled: true,
        schoolYear: 1000
      })
    );

    service.exportTargetScoresToCsv(
      <ExportTargetReportRequest>{
        assessment: <Assessment>{ type: 'ica', schoolYear: 1000 },
        targetScoreRows: [{}]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{}]);
  });
});
