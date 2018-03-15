import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from "../../../../shared/common.module";
import { TranslateModule } from "@ngx-translate/core";
import { TestModule } from "../../../../../test/test.module";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Assessment } from "../../../model/assessment.model";
import { WritingTraitScoresComponent } from "./writing-trait-scores.component";
import { MockAssessmentProvider } from "../../../../../test/mock.assessment.provider";
import { MockAssessmentExporter } from "../../../../../test/mock.assessment.exporter";

describe('WritingTraitScoresComponent', () => {
  let component: WritingTraitScoresComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        TestModule
      ],
      declarations: [
        TestComponentWrapper,
        WritingTraitScoresComponent
      ],
      providers: [
        ExamStatisticsCalculator
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<writing-trait-scores [assessmentProvider]="assessmentProvider" [assessmentExporter]="assessmentExporter" [assessment]="assessment" [exams]="[]"></writing-trait-scores>'
})
class TestComponentWrapper {
  assessmentProvider = new MockAssessmentProvider();
  assessmentExporter = new MockAssessmentExporter();
  assessment = new Assessment();
}


