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
import { PopoverModule } from "ngx-bootstrap/popover";
import { ScaleScoreComponent } from "./scale-score.component";
import { InformationLabelComponent } from "./information-label.component";
import { ItemViewerComponent } from "../items/item-viewer/item-viewer.component";
import { ItemTabComponent } from "../items/item-tab.component";
import { TabsModule } from "ngx-bootstrap";
import { Student } from "../../student/model/student.model";
import { PopupMenuComponent } from "../menu/popup-menu.component";
import { GradeDisplayPipe } from "../../shared/grade-display.pipe";
import { ColorService } from "../../shared/color.service";
import { Angulartics2Module, Angulartics2 } from "angulartics2";
import { ItemExemplarComponent } from "../items/item-exemplar/item-exemplar.component";
import { ItemScoresComponent } from "../items/item-scores/item-scores.component";
import { TestModule } from "../../../test/test.module";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { ItemInfoComponent } from "../items/item-info/item-info.component";

describe('AssessmentResultsComponent', () => {
  let component: AssessmentResultsComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DataTableModule,
        FormsModule,
        HttpModule,
        PopoverModule.forRoot(),
        SharedModule,
        TabsModule,
        TranslateModule.forRoot(),
        Angulartics2Module,
        TestModule
      ],
      declarations: [
        AssessmentResultsComponent,
        GradeDisplayPipe,
        InformationLabelComponent,
        ItemTabComponent,
        ItemViewerComponent,
        ItemInfoComponent,
        ItemExemplarComponent,
        ItemScoresComponent,
        PopupMenuComponent,
        RemoveCommaPipe,
        ScaleScoreComponent,
        TestComponentWrapper
      ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' } ,
        { provide: Angulartics2, useValue: mockAngulartics2 },
        ExamStatisticsCalculator,
        ExamFilterService,
        ColorService
      ]
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
    assessmentExam.exams.push(buildExam("Benoit", "ma-02", "2017-03-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-01", "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].filter).toBeTruthy();
    expect(component.sessions[ 1 ].filter).toBeFalsy();
  });

  it('should order by most recent', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit", "ma-02", "2017-01-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-01", "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].id).toBe("ma-01");
    expect(component.sessions[ 1 ].id).toBe("ma-02");
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
    assessmentExam.exams.push(buildExam("Benoit", "ma-02", "2017-03-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-01", "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    component.toggleSession(component.sessions[1]);
    expect(component.exams.length).toBe(2);

    component.toggleSession(component.sessions[1]);
    expect(component.exams.length).toBe(1);

    component.toggleSession(component.sessions[0]);
    expect(component.exams.length).toBe(0);
  });

  function buildExam(studentName:string, session:string, date:any) {
    let exam = new Exam();
    exam.student = new Student();
    exam.student.lastName = studentName;
    exam.session = session;
    exam.date = date;

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
