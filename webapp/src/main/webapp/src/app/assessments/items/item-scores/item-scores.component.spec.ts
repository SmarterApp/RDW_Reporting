import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemScoresComponent } from "./item-scores.component";
import { ItemViewerComponent } from "../item-viewer/item-viewer.component";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { StudentScoreService } from "./student-score.service";
import { Component } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { CommonModule } from "../../../shared/common.module";
import { TestModule } from "../../../../test/test.module";
import { PopoverModule } from "ngx-bootstrap";

describe('ItemScoresComponent', () => {
  let component: ItemScoresComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ DataTableModule, CommonModule, TestModule, PopoverModule.forRoot() ],
      declarations: [ TestComponentWrapper, ItemScoresComponent, ItemViewerComponent ],
      providers: [
        StudentScoreService
      ]
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
