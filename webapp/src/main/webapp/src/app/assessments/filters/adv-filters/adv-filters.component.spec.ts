import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdvFiltersComponent } from "./adv-filters.component";
import { APP_BASE_HREF } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Component } from "@angular/core";
import { FilterBy } from "../../model/filter-by.model";
import { CommonModule } from "../../../shared/common.module";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";
import { Angulartics2Module, Angulartics2 } from 'angulartics2';

describe('AdvFiltersComponent', () => {
  let component: AdvFiltersComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponentWrapper, AdvFiltersComponent ],
      imports: [ HttpModule, FormsModule, CommonModule, Angulartics2Module ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Angulartics2, useValue: mockAngulartics2 }
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
  template: '<adv-filters [filterBy]="filterBy" [filterOptions]="filterOptions"></adv-filters>'
})
class TestComponentWrapper {
  filterBy: FilterBy = new FilterBy();
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
}

