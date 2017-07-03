import { StudentResultsComponent } from "./student-results.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { AssessmentsModule } from "../../assessments/assessments.module";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "../../shared/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { Location } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { StudentExamHistory } from "../model/student-exam-history.model";
import { Student } from "../model/student.model";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

fdescribe('StudentResultsComponent', () => {
  let component: StudentResultsComponent;
  let fixture: ComponentFixture<StudentResultsComponent>;
  let mockRouteSnapshot: any = {};
  let location: MockLocation;

  beforeEach(async(() => {
    mockRouteSnapshot.data = {};
    mockRouteSnapshot.data.examHistory = MockBuilder.history();
    mockRouteSnapshot.queryParams = {};

    location = new MockLocation();

    TestBed.configureTestingModule({
      imports: [
        AssessmentsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        StudentResultsComponent
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: { snapshot: mockRouteSnapshot }
      }, {
        provide: Location,
        useValue: location
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});

class MockBuilder {
  static history(): StudentExamHistory {
    let student: Student = new Student(123, "ssid", "first", "last");
    return new StudentExamHistory(student, []);
  }
}

class MockLocation {
  replaceState: Spy = createSpy("replaceState");
}
