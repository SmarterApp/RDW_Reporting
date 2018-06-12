import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemScoresComponent } from "./item-scores.component";
import { StudentScoreService } from "./student-score.service";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { CommonModule } from "../../../shared/common.module";
import { TestModule } from "../../../../test/test.module";
import { RdwFormatModule } from '../../../shared/format/rdw-format.module';

describe('ItemScoresComponent', () => {
  let mockScoreService: any;

  let component: ItemScoresComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    mockScoreService = jasmine.createSpyObj("StudentScoreService", ["getScores"]);
    mockScoreService.getScores.and.returnValue([]);

    TestBed.configureTestingModule({
      declarations: [
        TestComponentWrapper,
        ItemScoresComponent
      ],
      imports: [
        CommonModule,
        TestModule
      ],
      providers: [
        { provide: StudentScoreService, useValue: mockScoreService}
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<item-scores [item]="item" [exams]="exams"></item-scores>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
  exams = [];
}
