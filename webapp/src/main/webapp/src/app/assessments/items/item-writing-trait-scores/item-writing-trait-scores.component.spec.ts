import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemWritingTraitScoresComponent } from './item-writing-trait-scores.component';

import { Component } from '@angular/core';
import { ReportingCommonModule } from '../../../shared/reporting-common.module';
import { TestModule } from '../../../../test/test.module';
import { AssessmentItem } from '../../model/assessment-item.model';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap';
import { StudentResponsesAssessmentItem } from '../../model/student-responses-item.model';

describe('ItemWritingTraitScoresComponent', () => {
  let component: ItemWritingTraitScoresComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReportingCommonModule,
        TranslateModule.forRoot(),
        PopoverModule.forRoot(),
        TestModule
      ],
      declarations: [TestComponentWrapper, ItemWritingTraitScoresComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[0].componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template:
    '<item-writing-trait-scores [responsesAssessmentItem]="item"></item-writing-trait-scores>'
})
class TestComponentWrapper {
  item: StudentResponsesAssessmentItem;

  constructor() {
    this.item = {
      assessmentItem: new AssessmentItem()
    };
  }
}
