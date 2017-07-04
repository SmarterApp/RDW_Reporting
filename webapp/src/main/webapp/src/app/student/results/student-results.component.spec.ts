import { StudentResultsComponent } from "./student-results.component";
import { ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { AssessmentsModule } from "../../assessments/assessments.module";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "../../shared/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { Location } from "@angular/common";
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
import { School } from "../../user/model/school.model";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import createSpyObj = jasmine.createSpyObj;

describe('StudentResultsComponent', () => {
  let component: StudentResultsComponent;
  let fixture: ComponentFixture<StudentResultsComponent>;
  let route: MockActivatedRoute;
  let location: MockLocation;

  beforeEach(() => {
    route = new MockActivatedRoute();

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = {};
    mockRouteSnapshot.data.examHistory = MockBuilder.history();
    mockRouteSnapshot.queryParams = {};
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    location = new MockLocation();

    TestBed.configureTestingModule({
      imports: [
        AssessmentsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        StudentResultsComponent
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: route
      }, {
        provide: Location,
        useValue: location
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve sorted assessment types', () => {
    expect(component.assessmentTypes)
      .toEqual([AssessmentType.IAB, AssessmentType.ICA, AssessmentType.SUMMATIVE]);
  });

  it('should retrieve subjects by assessment type', () => {
    expect(component.getSubjectsForType(AssessmentType.ICA))
      .toEqual(["ELA", "MATH"]);
    expect(component.getSubjectsForType(AssessmentType.IAB))
      .toEqual(["MATH"]);
    expect(component.getSubjectsForType(AssessmentType.SUMMATIVE))
      .toEqual(["ELA"]);
  });

  it('should filter by year on initialization', inject([ActivatedRoute], (route: MockActivatedRoute) => {
    // Filter to the single 2017 exam
    let snapshot = route.snapshot;
    snapshot.queryParams['schoolYear'] = '2017';

    component.ngOnInit();

    let assessmentTypes = component.assessmentTypes;
    expect(assessmentTypes.length).toBe(1);
    let subjects = component.getSubjectsForType(assessmentTypes[0]);
    expect(subjects.length).toBe(1);
    expect(component.examsByTypeAndSubject.get(assessmentTypes[0]).get(subjects[0]).length).toBe(1);
  }));

  it('should filter by subject on initialization', inject([ActivatedRoute], (route: MockActivatedRoute) => {
    let snapshot = route.snapshot;
    snapshot.queryParams['subject'] = 'MATH';

    component.ngOnInit();

    let assessmentTypes = component.assessmentTypes;
    expect(assessmentTypes.length).toBe(2);
    expect(component.getSubjectsForType(assessmentTypes[0])).toEqual(['MATH']);
    expect(component.getSubjectsForType(assessmentTypes[1])).toEqual(['MATH']);
  }));

});

function getFilteredExams(examMap: Map<AssessmentType, Map<string, StudentHistoryExamWrapper[]>>): StudentHistoryExamWrapper[] {
  return Array.from(examMap.values())
    .map((bySubject) => Array.from(bySubject.values()))
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => a.concat(b));
}

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

    let school: School = new School();
    school.id = 1;
    school.name = "A School";
    wrapper.school = school;

    return wrapper;
  }

  private static exam(type: AssessmentType): Exam {
    let exam: Exam = new Exam();
    exam.date = new Date();
    exam.economicDisadvantage = false;
    exam.ethnicities = [];
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
    exam.enrolledGrade = MockBuilder.oddExam ? 4 : 5;

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
    assessment.grade = 5;
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

class MockActivatedRoute {
  snapshotResult: Spy = createSpy("snapshot");

  get snapshot(): any {
    return this.snapshotResult();
  }
}

class MockLocation {
  replaceState: Spy = createSpy("replaceState");
}
