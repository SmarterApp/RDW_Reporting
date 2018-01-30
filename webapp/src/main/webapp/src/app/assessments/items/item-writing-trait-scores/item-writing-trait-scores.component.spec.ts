import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemWritingTraitScoresComponent } from "./item-writing-trait-scores.component";
import { DataTableModule } from "primeng/components/datatable/datatable";

import { Component } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { CommonModule } from "../../../shared/common.module";
import { TestModule } from "../../../../test/test.module";
import { PopoverModule } from "ngx-bootstrap";

describe('ItemWritingTraitScoresComponent', () => {
  let component: ItemWritingTraitScoresComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ DataTableModule, CommonModule, TestModule, PopoverModule.forRoot() ],
      declarations: [ TestComponentWrapper, ItemWritingTraitScoresComponent ]
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
