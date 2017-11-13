import { async, TestBed } from "@angular/core/testing";
import { Observable, Observer } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { AssessmentsComponent } from "./assessments.component";
import { Exam } from "./model/exam.model";
import { ExamFilterOptionsService } from "./filters/exam-filters/exam-filter-options.service";
import { GroupAssessmentService } from "../groups/results/group-assessment.service";
import { Assessment } from "./model/assessment.model";
import { AssessmentExam } from "./model/assessment-exam.model";
import { ExamFilterOptions } from "./model/exam-filter-options.model";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { Angulartics2 } from 'angulartics2';
import { UserService } from "../user/user.service";
import { MockUserService } from "../../test/mock.user.service";

let examObserver: Observer<Exam[]>;
describe('AssessmentsComponent', () => {
  let component: AssessmentsComponent;
  let fixture;
  let mockRouteSnapshot;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

  beforeEach(async(() => {

    mockRouteSnapshot = getRouteSnapshot();
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        AssessmentsComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: { snapshot: mockRouteSnapshot } },
        { provide: ExamFilterOptionsService, useClass: MockExamFilterOptionsService },
        { provide: GroupAssessmentService, useClass: MockAssessmentService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(AssessmentsComponent);
    component = fixture.componentInstance;
    component.assessmentExams = [ new AssessmentExam(), new AssessmentExam() ];
    component.assessmentProvider = new MockAssessmentService() as any;

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      done();
    });
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load assessment exams when selected assessments changed', () => {
    let assessment = new Assessment();
    assessment.id = 54;
    assessment.selected = true;

    component.showOnlyMostRecent = false;
    component.availableAssessments = [ assessment ];
    component.selectedAssessmentsChanged(assessment);

    // Return mock api result.
    examObserver.next([new Exam(), new Exam(), new Exam()]);

    let actual = component.assessmentExams;
    expect(actual.length).toBe(1);
    expect(actual[0].assessment.id).toBe(assessment.id);
    expect(actual[0].exams.length).toBe(3);
  });

  it('should remove assessment exams when selected assessments changed', () => {
    let assessment = new Assessment();
    assessment.id = 54;
    assessment.selected = false;

    let assessmentExam = new AssessmentExam();
    assessmentExam.assessment = assessment;
    assessmentExam.exams = [ new Exam(), new Exam() ];

    component.showOnlyMostRecent = false;
    component.availableAssessments = [ assessment ];
    component.assessmentExams = [ assessmentExam ];

    component.selectedAssessmentsChanged(assessment);
    let actual = component.assessmentExams;

    expect(actual.length).toBe(0);
  });

  it('should cancel assessments in flight', () => {
    let assessment = new Assessment();
    assessment.id = 54;
    assessment.selected = true;

    component.showOnlyMostRecent = false;
    component.availableAssessments = [ assessment ];

    component.selectedAssessmentsChanged(assessment);

    let actual = component.assessmentsLoading;
    expect(actual.length).toBe(1);
    expect(actual[0].assessment.id).toBe(assessment.id);
    expect(component.assessmentExams.length).toBe(0);

    assessment.selected = false;
    component.selectedAssessmentsChanged(assessment);

    actual = component.assessmentsLoading;
    expect(actual.length).toBe(0);
    expect(component.assessmentExams.length).toBe(0);

    // Return mock api result, no one should be listening.
    examObserver.next([new Exam(), new Exam(), new Exam()]);

    expect(actual.length).toBe(0);
    expect(component.assessmentExams.length).toBe(0);
  });
});


function getRouteSnapshot() {
  return {
    data: {
      user: {
        groups: [
          {
            id: 2,
            name: "Anderson's 4th grade."
          }
        ],
        assessments: [ {
          name: "Measurements & Data"
        } ]
      }
    },
    params: {
      groupId: 2
    }
  };
}

class MockExamFilterOptionsService {
  public getExamFilterOptions() {

    let result = new ExamFilterOptions();
    result.schoolYears = [ 2009, 2008, 2007, 2006, 2005 ];
    result.ethnicities = [ "AmericanIndianOrAlaskaNative", "Asian", "BlackOrAfricanAmerican" ];

    return Observable.of(result);
  }
}

class MockAssessmentService {
  public getAvailableAssessments() {
    return Observable.of([])
  }

  public getExams() {
    let observable = new Observable<Exam[]>(observer => examObserver = observer);
    return observable;
  }
}
