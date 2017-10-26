import { StudentResultsComponent } from "./student-results.component";
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { AssessmentsModule } from "../../assessments/assessments.module";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "../../shared/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { TranslateModule } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { Student } from "../model/student.model";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StudentHistoryExamWrapper } from "../model/student-history-exam-wrapper.model";
import { Exam } from "../../assessments/model/exam.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { ClaimScore } from "../../assessments/model/claim-score.model";
import { MockRouter } from "../../../test/mock.router";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { Angulartics2 } from "angulartics2";
import { UserService } from "../../user/user.service";
import { MockUserService } from "../../../test/mock.user.service";
import { ReportModule } from "../../report/report.module";
import { MockActivatedRoute } from "../../../test/mock.activated-route";
import { PopoverModule } from "ngx-bootstrap";
import { UserModule } from "../../user/user.module";
import { RouterTestingModule } from "@angular/router/testing";

describe('StudentResultsComponent', () => {
  let component: StudentResultsComponent;
  let fixture: ComponentFixture<StudentResultsComponent>;
  let route: MockActivatedRoute;
  let router: MockRouter;
  let exportService: any;

  beforeEach(() => {
    route = new MockActivatedRoute();
    exportService = {};

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = {};
    mockRouteSnapshot.data.examHistory = MockBuilder.history();
    mockRouteSnapshot.params = {};
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

    router = new MockRouter();

    TestBed.configureTestingModule({
      imports: [
        AssessmentsModule,
        BrowserModule,
        CommonModule,
        UserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        ReportModule,
        TranslateModule.forRoot(),
        PopoverModule.forRoot(),
        ReportModule
      ],
      declarations: [
        StudentResultsComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: CsvExportService, useValue: exportService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentResultsComponent);
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

  it('should retrieve sorted assessment types', () => {
    expect(component.assessmentTypes)
      .toEqual([ AssessmentType.IAB, AssessmentType.ICA, AssessmentType.SUMMATIVE ]);
  });

  it('should retrieve subjects by assessment type', () => {
    expect(component.getSubjectsForType(AssessmentType.ICA))
      .toEqual([ "ELA", "MATH" ]);
    expect(component.getSubjectsForType(AssessmentType.IAB))
      .toEqual([ "MATH" ]);
    expect(component.getSubjectsForType(AssessmentType.SUMMATIVE))
      .toEqual([ "ELA" ]);
  });

  it('should filter by year on initialization', inject([ ActivatedRoute ], (route: MockActivatedRoute) => {
    // Filter to the single 2017 exam
    let snapshot = route.snapshot;
    snapshot.params[ 'schoolYear' ] = '2017';

    component.ngOnInit();

    let assessmentTypes = component.assessmentTypes;
    expect(assessmentTypes.length).toBe(1);
    let subjects = component.getSubjectsForType(assessmentTypes[ 0 ]);
    expect(subjects.length).toBe(1);
    expect(component.examsByTypeAndSubject.get(assessmentTypes[ 0 ]).get(subjects[ 0 ]).length).toBe(1);
  }));

  it('should filter by subject on initialization', inject([ ActivatedRoute ], (route: MockActivatedRoute) => {
    let snapshot = route.snapshot;
    snapshot.params[ 'subject' ] = 'MATH';

    component.ngOnInit();

    let assessmentTypes = component.assessmentTypes;
    expect(assessmentTypes.length).toBe(2);
    expect(component.getSubjectsForType(assessmentTypes[ 0 ])).toEqual([ 'MATH' ]);
    expect(component.getSubjectsForType(assessmentTypes[ 1 ])).toEqual([ 'MATH' ]);
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
    student.ssid = "ssid";
    student.firstName = "first";
    student.lastName = "last";

    let exams: StudentHistoryExamWrapper[] = [];
    exams.push(MockBuilder.examWrapper(AssessmentType.ICA, "MATH"));
    exams.push(MockBuilder.examWrapper(AssessmentType.ICA, "ELA"));
    exams.push(MockBuilder.examWrapper(AssessmentType.IAB, "MATH"));
    exams.push(MockBuilder.examWrapper(AssessmentType.SUMMATIVE, "ELA"));

    let history: StudentExamHistory = new StudentExamHistory();
    history.student = student;
    history.exams = exams;
    return history;
  }

  private static examWrapper(assessmentType: AssessmentType, subject: string): StudentHistoryExamWrapper {
    let wrapper: StudentHistoryExamWrapper = new StudentHistoryExamWrapper();
    wrapper.exam = MockBuilder.exam(assessmentType);
    wrapper.assessment = MockBuilder.assessment(assessmentType, subject);

    return wrapper;
  }

  private static exam(type: AssessmentType): Exam {
    let exam: Exam = new Exam();
    exam.date = new Date();
    exam.economicDisadvantage = false;
    exam.id = MockBuilder.examIdx++;
    exam.iep = false;
    exam.level = 3;
    exam.limitedEnglishProficiency = false;
    exam.migrantStatus = false;
    exam.plan504 = false;
    exam.score = 2594;
    exam.session = "PRI-6888";
    exam.standardError = 52;

    //Give each exam an earlier year than the one before.
    exam.schoolYear = 2017 - exam.id;

    //toggle whether we're off-grade on each exam
    exam.enrolledGrade = MockBuilder.oddExam ? '04' : '05';

    //toggle completeness on each exam
    exam.completeness = MockBuilder.oddExam ? 'Partial' : 'Complete';

    MockBuilder.oddExam = !MockBuilder.oddExam;

    exam.claimScores = [];
    if (type !== AssessmentType.IAB) {
      exam.claimScores.push(MockBuilder.claimScore(1));
      exam.claimScores.push(MockBuilder.claimScore(2));
    }

    exam.administrativeCondition = type === AssessmentType.SUMMATIVE ? 'Valid' : 'NS';

    return exam;
  }

  private static assessment(type: AssessmentType, subject: string): Assessment {
    let assessment: Assessment = new Assessment();
    assessment.grade = '05';
    assessment.id = MockBuilder.assessmentIdx++;
    assessment.name = "Grade 5 ELA";
    assessment.subject = subject;
    assessment.type = type;

    assessment.claimCodes = [];
    if (type !== AssessmentType.IAB) {
      assessment.claimCodes.push("1");
      assessment.claimCodes.push("2-W");
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

