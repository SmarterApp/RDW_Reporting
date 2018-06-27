import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AssessmentResultsComponent } from "./assessment-results.component";
import { APP_BASE_HREF } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { ExamFilterService } from "../filters/exam-filters/exam-filter.service";
import { Student } from "../../student/model/student.model";
import { ColorService } from "../../shared/color.service";
import { Angulartics2 } from "angulartics2";
import { TestModule } from "../../../test/test.module";
import { MockDataService } from "../../../test/mock.data.service";
import { CommonModule } from "../../shared/common.module";
import { InstructionalResourcesService } from "./instructional-resources.service";
import { CachingDataService } from "../../shared/data/caching-data.service";
import { DataService } from "../../shared/data/data.service";
import { AssessmentPercentileService } from "../percentile/assessment-percentile.service";
import { MockUserService } from "../../../test/mock.user.service";
import { ApplicationSettingsService } from '../../app-settings.service';
import { of } from 'rxjs/observable/of';
import { SubjectService } from '../../subject/subject.service';

describe('AssessmentResultsComponent', () => {
  let component: AssessmentResultsComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;
  let dataService: MockDataService;
  let mockUserService: MockUserService;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

  const settings = {
    percentileDisplayEnabled: true
  };

  const mockApplicationSettingsService = jasmine.createSpyObj('ApplicationSettingsService', [ 'getSettings' ]);
  mockApplicationSettingsService.getSettings.and.callFake(() => of(settings));

  const mockSubjectService = jasmine.createSpyObj('SubjectService', [ 'getSubjectDefinitionForAssessment' ]);
  mockSubjectService.getSubjectDefinitionForAssessment.and.callFake(() => of(null));

  beforeEach(async(() => {
    dataService = new MockDataService();
    mockUserService = new MockUserService();

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        TranslateModule.forRoot(),
        TestModule
      ],
      declarations: [
        AssessmentResultsComponent,
        TestComponentWrapper
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        ExamStatisticsCalculator,
        ExamFilterService,
        ColorService,
        InstructionalResourcesService,
        CachingDataService,
        DataService,
        AssessmentPercentileService,
        { provide: ApplicationSettingsService, useValue: mockApplicationSettingsService },
        { provide: SubjectService, useValue: mockSubjectService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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

  it('should take most recent date for each session', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit", "ma-02", "2017-01-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-01", "2017-03-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Joe", "ma-02", "2017-01-03T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Jane", "ma-01", "2017-03-02T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].date).toBe("2017-03-02T17:05:26Z");
    expect(component.sessions[ 1 ].date).toBe("2017-01-03T17:05:26Z");
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
    component.toggleSession(component.sessions[ 1 ]);
    expect(component.exams.length).toBe(2);

    component.toggleSession(component.sessions[ 1 ]);
    expect(component.exams.length).toBe(1);

    component.toggleSession(component.sessions[ 0 ]);
    expect(component.exams.length).toBe(0);
  });

  it('should handle all null sessions', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit", null, "2017-03-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", null, "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].filter).toBeTruthy();
  });

  it('should handle some null sessions', () => {
    let assessmentExam = new AssessmentExam();
    assessmentExam.exams.push(buildExam("Benoit", null, "2017-03-01T17:05:26Z"));
    assessmentExam.exams.push(buildExam("Wood", "ma-12", "2017-03-01T17:05:26Z"));

    component.assessmentExam = assessmentExam;
    expect(component.sessions[ 0 ].filter).toBeTruthy();
    expect(component.sessions[ 0 ].id).toBeNull();
    expect(component.sessions[ 1 ].filter).toBeFalsy();
    expect(component.sessions[ 1 ].id).toEqual("ma-12");
  });

  function buildExam(studentName: string, session: string, date: any) {
    let exam = new Exam();
    exam.student = new Student();
    exam.student.lastName = studentName;
    exam.session = session;
    exam.date = date;
    exam.claimScores = [];

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


