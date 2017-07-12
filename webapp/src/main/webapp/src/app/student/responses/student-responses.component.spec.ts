import { StudentResponsesComponent } from "./student-responses.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssessmentTypePipe } from "../../shared/assessment-type.pipe";
import { GradeDisplayPipe } from "../../shared/grade-display.pipe";
import { ColorService } from "../../shared/color.service";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";
import { Exam } from "../../assessments/model/exam.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ExamItemScore } from "../../assessments/model/exam-item-score.model";
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

describe('StudentResponsesComponent', () => {
  let component: StudentResponsesComponent;
  let fixture: ComponentFixture<StudentResponsesComponent>;
  let route: MockActivatedRoute;

  beforeEach(() => {
    route = new MockActivatedRoute();

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = {
      assessmentItems: [],
      exam: new Exam(),
      assessment: new Assessment()
    };
    mockRouteSnapshot.params = {};
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        AssessmentTypePipe,
        GradeDisplayPipe,
        StudentResponsesComponent
      ],
      providers: [
        ColorService, {
        provide: ActivatedRoute,
        useValue: route
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate correctness property', () => {
    let fullCredit = new AssessmentItem();
    fullCredit.maxPoints = 2;
    fullCredit.scores = [new ExamItemScore()];
    fullCredit.scores[0].points = 2;

    let halfCredit = new AssessmentItem();
    halfCredit.maxPoints = 2;
    halfCredit.scores = [new ExamItemScore()];
    halfCredit.scores[0].points = 1;

    let mockRouteSnapshot: any = route.snapshot;
    mockRouteSnapshot.data.assessmentItems.push(fullCredit);
    mockRouteSnapshot.data.assessmentItems.push(halfCredit);

    fixture = TestBed.createComponent(StudentResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.assessmentItems[0].correctness).toBe(1);
    expect(component.assessmentItems[1].correctness).toBe(0.5);
  });

});

class MockActivatedRoute {
  snapshotResult: Spy = createSpy("snapshot");

  get snapshot(): any {
    return this.snapshotResult();
  }
}
