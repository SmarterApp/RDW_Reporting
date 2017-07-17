import { StudentResultsFilterComponent } from "./student-results-filter.component";
import {ComponentFixture, async, TestBed, inject} from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "primeng/components/common/shared";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AssessmentsModule } from "../../assessments/assessments.module";
import { CommonModule } from "../../shared/common.module";
import { Angulartics2Module, Angulartics2 } from 'angulartics2';
import { PopoverModule } from "ngx-bootstrap";

describe('StudentResultsFilterComponent', () => {
  let component: StudentResultsFilterComponent;
  let fixture: ComponentFixture<StudentResultsFilterComponent>;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AssessmentsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forRoot(),
        Angulartics2Module,
        PopoverModule.forRoot(),
      ],
      declarations: [
        StudentResultsFilterComponent
      ],
      providers: [
        { provide: Angulartics2, useValue: mockAngulartics2 }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentResultsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event if advanced filters change', (done) => {
    component.filterChange.subscribe(() => {
      //Assert that the output emits
      done();
    });

    component.filterState.filterBy.administration = "new value";
  });

  it('should remove an advanced filter', () => {
    let eventCount = 0;
    component.filterChange.subscribe(() => {
      eventCount++;
    });

    component.filterState.filterBy.administration = "new value";
    component.removeFilter("administration");
    expect(eventCount).toBe(2);
  });
});
