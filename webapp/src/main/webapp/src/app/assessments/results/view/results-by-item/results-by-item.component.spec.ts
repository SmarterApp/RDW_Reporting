import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsByItemComponent } from './results-by-item.component';
import { DataTableModule, SharedModule } from "primeng/primeng";
import { FormsModule } from "@angular/forms";
import { PopoverModule, TabsModule } from "ngx-bootstrap";
import { CommonModule } from "../../../../shared/common.module";
import { ReportModule } from "../../../../report/report.module";
import { TranslateModule } from "@ngx-translate/core";
import { TestModule } from "../../../../../test/test.module";
import { Angulartics2 } from "angulartics2";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { ItemTabComponent } from "../../../items/item-tab.component";
import { ClaimTargetComponent } from "../../claim-target.component";
import { ItemInfoComponent } from "../../../items/item-info/item-info.component";
import { ItemExemplarComponent } from "../../../items/item-exemplar/item-exemplar.component";
import { ItemScoresComponent } from "../../../items/item-scores/item-scores.component";
import { ItemViewerComponent } from "../../../items/item-viewer/item-viewer.component";
import { Component } from "@angular/core";
import { Assessment } from "../../../model/assessment.model";
import { MockAssessmentProvider } from "../../../../../test/mock.assessment.provider";

describe('ResultsByItemComponent', () => {
  let component: ResultsByItemComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;
  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DataTableModule,
        FormsModule,
        SharedModule,
        PopoverModule.forRoot(),
        CommonModule,
        ReportModule,
        TabsModule,
        TranslateModule.forRoot(),
        TestModule
      ],
      declarations: [
        TestComponentWrapper,
        ResultsByItemComponent,
        ItemTabComponent,
        ClaimTargetComponent,
        ItemInfoComponent,
        ItemExemplarComponent,
        ItemScoresComponent,
        ItemViewerComponent
      ],
      providers: [
        { provide: Angulartics2, useValue: mockAngulartics2 },
        ExamStatisticsCalculator
      ]
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
  template: '<results-by-item [assessmentProvider]="assessmentProvider" [assessment]="assessment" [exams]="[]"></results-by-item>'
})
class TestComponentWrapper {
  assessmentProvider = new MockAssessmentProvider();
  assessment = new Assessment();
}
