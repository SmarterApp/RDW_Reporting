import { StudentResultsFilterComponent } from "./student-results-filter.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "../../shared/common.module";
import { Angulartics2 } from 'angulartics2';
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('StudentResultsFilterComponent', () => {
  let component: StudentResultsFilterComponent;
  let fixture: ComponentFixture<StudentResultsFilterComponent>;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        StudentResultsFilterComponent
      ],
      providers: [
        { provide: Angulartics2, useValue: mockAngulartics2 }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
