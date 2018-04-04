import { StudentResultsComponent } from "./student-results.component";
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { CommonModule } from "../../shared/common.module";
import { ActivatedRoute } from "@angular/router";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { Student } from "../model/student.model";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";
import { Exam } from "../../assessments/model/exam.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ClaimScore } from "../../assessments/model/claim-score.model";
import { MockRouter } from "../../../test/mock.router";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { Angulartics2 } from "angulartics2";
import { MockActivatedRoute } from "../../../test/mock.activated-route";
import { ExamFilterService } from "../../assessments/filters/exam-filters/exam-filter.service";
import { of } from 'rxjs/observable/of';
import { ApplicationSettingsService } from '../../app-settings.service';
import { MockUserService } from '../../../test/mock.user.service';
import { TestModule } from "../../../test/test.module";
import { ReportingEmbargoService } from "../../shared/embargo/reporting-embargo.service";

describe('StudentResultsComponent', () => {
  let component: StudentResultsComponent;
  let fixture: ComponentFixture<StudentResultsComponent>;
  let route: MockActivatedRoute;
  let router: MockRouter;
  let exportService: any;
  let embargoService: any;

  beforeEach(() => {
    exportService = {};
    embargoService = jasmine.createSpyObj('ReportingEmbargoService', ['isEmbargoed']);
    embargoService.isEmbargoed.and.returnValue(of(false));

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = {};
    mockRouteSnapshot.data.examHistory = MockBuilder.history();
    mockRouteSnapshot.params = {};

    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

    const mockApplicationSettingsService = jasmine.createSpyObj('ApplicationSettingsService', ['getSettings']);
    mockApplicationSettingsService.getSettings.and.callFake(() => of({minItemDataYear: 2016}));

    const mockUserService = new MockUserService();

    router = new MockRouter();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TestModule
      ],
      declarations: [
        StudentResultsComponent
      ],
      providers: [
        { provide: CsvExportService, useValue: exportService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: ApplicationSettingsService, useValue: mockApplicationSettingsService },
        { provide: ReportingEmbargoService, useValue: embargoService },
        ExamFilterService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentResultsComponent);
    route = TestBed.get(ActivatedRoute);
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create without error when history is null', () => {
    let snapshot = route.snapshot;
    snapshot.params[ 'schoolYear' ] = '2017';
    snapshot.data['examHistory'] = null;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should filter by year on initialization', inject([ ActivatedRoute ], (route: MockActivatedRoute) => {
    // Filter to the single 2017 exam
    const snapshot = route.snapshot;
    snapshot.params[ 'schoolYear' ] = '2017';

    component.ngOnInit();

    const filteredExams = component.sections.reduce((exams, section) => {
      exams.push(...section.filteredExams);
      return exams;
    }, []);

    const totalAssessmentTypes = filteredExams.reduce(
      (collection, exam) => collection.add(exam.assessment.type), new Set()).size;

    const totalSubjects = filteredExams.reduce(
      (collection, exam) => collection.add(exam.assessment.subject), new Set()).size;

    expect(totalAssessmentTypes).toBe(1);
    expect(totalSubjects).toBe(1);

  }));

  it('should filter by subject on initialization', inject([ ActivatedRoute ], (route: MockActivatedRoute) => {
    const snapshot = route.snapshot;
    snapshot.params[ 'subject' ] = 'MATH';

    component.ngOnInit();

    const filteredExams = component.sections.reduce((exams, section) => {
      exams.push(...section.filteredExams);
      return exams;
    }, []);

    filteredExams.forEach(exam => {
      expect(exam.assessment.subject).toBe('MATH');
    });
  }));

});

class MockBuilder {
  private static assessmentIdx: number = 0;
  private static examIdx: number = 0;
  private static oddExam: boolean;

  static history(): StudentExamHistory {
    MockBuilder.assessmentIdx = 0;
    MockBuilder.examIdx = 0;
    MockBuilder.oddExam = false;

    let student: Student = new Student();
    student.id = 123;
    student.ssid = 'ssid';
    student.firstName = 'first';
    student.lastName = 'last';

    let exams: StudentHistoryExamWrapper[] = [];
    exams.push(MockBuilder.examWrapper('ica', 'MATH'));
    exams.push(MockBuilder.examWrapper('ica', 'ELA'));
    exams.push(MockBuilder.examWrapper('iab', 'MATH'));
    exams.push(MockBuilder.examWrapper('sum', 'ELA'));

    let history: StudentExamHistory = new StudentExamHistory();
    history.student = student;
    history.exams = exams;
    return history;
  }

  private static examWrapper(assessmentType: string, subject: string): StudentHistoryExamWrapper {
    let wrapper: StudentHistoryExamWrapper = new StudentHistoryExamWrapper();
    wrapper.exam = MockBuilder.exam(assessmentType);
    wrapper.assessment = MockBuilder.assessment(assessmentType, subject);

    return wrapper;
  }

  private static exam(type: string): Exam {
    let exam: Exam = new Exam();
    exam.date = new Date();
    exam.id = MockBuilder.examIdx++;
    exam.iep = false;
    exam.level = 3;
    exam.limitedEnglishProficiency = false;
    exam.migrantStatus = false;
    exam.plan504 = false;
    exam.score = 2594;
    exam.session = 'PRI-6888';
    exam.standardError = 52;

    //Give each exam an earlier year than the one before.
    exam.schoolYear = 2017 - exam.id;

    //toggle whether we're off-grade on each exam
    exam.enrolledGrade = MockBuilder.oddExam ? '04' : '05';

    //toggle completeness on each exam
    exam.completeness = MockBuilder.oddExam ? 'Partial' : 'Complete';

    MockBuilder.oddExam = !MockBuilder.oddExam;

    exam.claimScores = [];
    if (type !== 'iab') {
      exam.claimScores.push(MockBuilder.claimScore(1));
      exam.claimScores.push(MockBuilder.claimScore(2));
    }

    exam.administrativeCondition = type === 'sum' ? 'Valid' : 'NS';

    return exam;
  }

  private static assessment(type: string, subject: string): Assessment {
    let assessment: Assessment = new Assessment();
    assessment.grade = '05';
    assessment.id = MockBuilder.assessmentIdx++;
    assessment.label = 'Grade 5 ELA';
    assessment.subject = subject;
    assessment.type = type;

    assessment.claimCodes = [];
    if (type !== 'iab') {
      assessment.claimCodes.push('1');
      assessment.claimCodes.push('2-W');
    }

    return assessment;
  }

  private static claimScore(level: number): ClaimScore {
    let score: ClaimScore = new ClaimScore();
    score.level = level;
    score.score = 1234;
    score.standardError = 25;

    return score;
  }
}

