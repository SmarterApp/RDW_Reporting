import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdvFiltersComponent } from "./adv-filters.component";
import { APP_BASE_HREF } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Component } from "@angular/core";
import { FilterBy } from "../../model/filter-by.model";
import { CommonModule } from "../../../shared/common.module";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";

describe('AdvFiltersComponent', () => {
  let component: AdvFiltersComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponentWrapper, AdvFiltersComponent ],
      imports: [ HttpModule, FormsModule, CommonModule ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' } ]
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
  template: '<adv-filters [filterBy]="filterBy" [filterOptions]="filterOptions"></adv-filters>'
})
class TestComponentWrapper {
  filterBy: FilterBy = new FilterBy();
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
}

