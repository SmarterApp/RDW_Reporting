import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupResultsComponent } from "./group-results.component";
import { Observable, Observer } from "rxjs";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { AppModule } from "../../app.module";
import { ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { ExamFilterOptionsService } from "./exam-filters/exam-filter-options.service";
import { ExamFilterOptions } from "./model/exam-filter-options.model";
import { Exam } from "./model/exam.model";
import { AssessmentService } from "./assessment/assessment.service";
import { Assessment } from "./model/assessment.model";
import { AssessmentExam } from "./model/assessment-exam.model";
import { exam } from "../../standalone/data/exam";

let examObserver: Observer<Exam[]>;
describe('GroupResultsComponent', () => {
  let component: GroupResultsComponent;
  let fixture: ComponentFixture<GroupResultsComponent>;
  let mockRouteSnapshot;


  beforeEach(async(() => {

    mockRouteSnapshot = getRouteSnapshot();
    TestBed.configureTestingModule({
      imports: [ HttpModule, FormsModule, AppModule ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' }, {
        provide: ActivatedRoute,
        useValue: { snapshot: mockRouteSnapshot }
      }, {
        provide: ExamFilterOptionsService,
        useClass: MockExamFilterOptionsService
      }, {
        provide: AssessmentService,
        useClass: MockAssessmentService
      } ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to current year if no school year is set', () => {
    let params = {};
    let actual = component.mapParamsToSchoolYear(params);

    expect(actual).toBe(2009);
  });

  it('should map schoolyear to filterBy object', () => {
    let params = { schoolYear: 2005 };

    let actual = component.mapParamsToSchoolYear(params);

    expect(actual).toBe(2005);
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

  it("should detect if all results are collapsed", () => {
    let assessmentExamA = new AssessmentExam();
    let assessmentExamB = new AssessmentExam();
    component.assessmentExams = [ assessmentExamA, assessmentExamB ];
    expect(component.allCollapsed).toBe(false);

    assessmentExamA.collapsed = true;
    expect(component.allCollapsed).toBe(false);

    assessmentExamB.collapsed = true;
    expect(component.allCollapsed).toBe(true);
  });
});


function getRouteSnapshot() {
  return {
    data: {
      groups: [
        {
          id: 2,
          name: "Anderson's 4th grade."
        }
      ],
      assessments: [ {
        name: "Measurements & Data"
      } ]
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



