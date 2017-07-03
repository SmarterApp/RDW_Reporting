import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AssessmentResultsComponent } from "./assessment-results.component";
import { APP_BASE_HREF } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Component } from "@angular/core";
import { SharedModule } from "primeng/components/common/shared";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { RemoveCommaPipe } from "../../shared/remove-comma.pipe";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { ExamFilterService } from "../filters/exam-filters/exam-filter.service";
import { GradeService } from "../../shared/grade.service";
import { PopoverModule } from "ngx-bootstrap/popover";
import { ScaleScorePipe } from "../../shared/scale-score.pipe";

describe('AssessmentResultsComponent', () => {
  let component: AssessmentResultsComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), HttpModule, FormsModule, DataTableModule, SharedModule, BrowserAnimationsModule, PopoverModule.forRoot()],
      declarations: [ TestComponentWrapper, AssessmentResultsComponent, RemoveCommaPipe, ScaleScorePipe ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' } , ExamStatisticsCalculator, ExamFilterService, GradeService ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;

    fixture.detectChanges();

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the first session', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit, Jordan", "ma-02"));
    assessmentExam.exams.push(buildExam("Wood, Michael", "ma-01"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].filter).toBeTruthy();
    expect(component.sessions[ 1 ].filter).toBeFalsy();
  });

  it('should toggle sessions filtered to true and false', () => {
    let session = { id: "ma-02", filter: undefined, exams: [] };

    component.toggleSession(session);
    expect(session.filter).toBeTruthy();

    component.toggleSession(session);
    expect(session.filter).toBeFalsy();
  });

  it('should add/remove filtered sessions', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit, Jordan", "ma-02"));
    assessmentExam.exams.push(buildExam("Wood, Michael", "ma-01"));

    component.assessmentExam = assessmentExam;
    component.toggleSession(component.sessions[1]);
    expect(component.exams.length).toBe(2);

    component.toggleSession(component.sessions[1]);
    expect(component.exams.length).toBe(1);

    component.toggleSession(component.sessions[0]);
    expect(component.exams.length).toBe(0);
  });

  function buildExam(studentName:string, session:string) {
    let exam = new Exam();
    exam.studentName = studentName;
    exam.session = session;

    return exam;
  }
});

@Component({
  selector: 'test-component-wrapper',
  template: '<assessment-results [assessmentExam]="assessment"></assessment-results>'
})
class TestComponentWrapper {
  assessment = new AssessmentExam();
}
