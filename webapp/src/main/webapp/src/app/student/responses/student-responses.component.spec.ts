import { StudentResponsesComponent } from "./student-responses.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ColorService } from "../../shared/color.service";
import { AssessmentItem } from "../../assessments/model/assessment-item.model";
import { Exam } from "../../assessments/model/exam.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ExamItemScore } from "../../assessments/model/exam-item-score.model";
import { Student } from "../model/student.model";
import { OptionalPipe } from "../../shared/optional.pipe";
import { AuthorizationDirective } from "../../shared/security/authorization.directive";
import { AuthorizationService } from "../../shared/security/authorization.service";
import { PermissionService } from "../../shared/security/permission.service";
import { WritingTraitScores } from "../../assessments/model/writing-trait-scores.model";
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
      assessment: new Assessment(),
      student: new Student()
    };
    mockRouteSnapshot.params = {};
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        AuthorizationDirective,
        OptionalPipe,
        StudentResponsesComponent
      ],
      providers: [
        AuthorizationService,
        ColorService,
        PermissionService,
        { provide: ActivatedRoute, useValue: route }
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

  it('should init when student is null', () => {
    route.snapshot.data[ "student" ] = null;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should init when assessment is null', () => {
    route.snapshot.data[ "assessment" ] = null;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should calculate correctness property', () => {
    let fullCredit = new AssessmentItem();
    fullCredit.maxPoints = 2;
    fullCredit.scores = [ new ExamItemScore() ];
    fullCredit.scores[ 0 ].points = 2;

    let halfCredit = new AssessmentItem();
    halfCredit.maxPoints = 2;
    halfCredit.scores = [ new ExamItemScore() ];
    halfCredit.scores[ 0 ].points = 1;

    let mockRouteSnapshot: any = route.snapshot;
    mockRouteSnapshot.data.assessmentItems.push(fullCredit);
    mockRouteSnapshot.data.assessmentItems.push(halfCredit);

    fixture = TestBed.createComponent(StudentResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.assessmentItems[ 0 ].correctness).toBe(1);
    expect(component.assessmentItems[ 1 ].correctness).toBe(0.5);
  });

  it('should handle a missing score', () => {
    const score: ExamItemScore = new ExamItemScore();
    score.points = 1;
    score.position = 1;
    score.response = "A";
    score.writingTraitScores = new WritingTraitScores();
    score.writingTraitScores.organization = 123;
    score.writingTraitScores.conventions = 456;
    score.writingTraitScores.evidence = 789;

    const scoredItem: AssessmentItem = new AssessmentItem();
    scoredItem.maxPoints = 2;
    scoredItem.scores = [score];

    const unscoredItem: AssessmentItem = new AssessmentItem();
    unscoredItem.maxPoints = 2;

    let mockRouteSnapshot: any = route.snapshot;
    mockRouteSnapshot.data.assessmentItems.push(scoredItem);
    mockRouteSnapshot.data.assessmentItems.push(unscoredItem);

    fixture = TestBed.createComponent(StudentResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.assessmentItems[ 0 ].writingTraitScores).toBe(score.writingTraitScores);
    expect(component.assessmentItems[ 1 ].writingTraitScores).toBeUndefined();
    expect(component.assessmentItems[ 1 ].writingTraitScores == null).toBe(true);
  });

});

class MockActivatedRoute {
  snapshotResult: Spy = createSpy("snapshot");

  get snapshot(): any {
    return this.snapshotResult();
  }
}
