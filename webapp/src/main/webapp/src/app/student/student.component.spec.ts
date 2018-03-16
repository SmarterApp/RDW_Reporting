import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StudentComponent } from "./student.component";
import { CommonModule } from "../shared/common.module";
import { AbstractControl } from "@angular/forms";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { Router } from "@angular/router";
import { MockRouter } from "../../test/mock.router";
import { of } from 'rxjs/observable/of';
import { TestModule } from "../../test/test.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import Spy = jasmine.Spy;

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let service: MockStudentExamHistoryService;
  let router: MockRouter;

  beforeEach(async(() => {
    service = new MockStudentExamHistoryService();
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TestModule
      ],
      declarations: [ StudentComponent ],
      providers: [
        { provide: StudentExamHistoryService, useValue: service }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for an existing student with exams and navigate if it exists', () => {
    let textInput: AbstractControl = component.searchForm.controls['ssid'];
    textInput.setValue("test-ssid");

    service.existsBySsid.and.returnValue(of({id: 123}));
    component.performSearch();

    expect(service.existsBySsid.calls.first().args[0]).toBe("test-ssid");
    expect(router.navigateByUrl.calls.first().args[0]).toBe("/students/123");
    expect(component.studentNotFound).toBe(false);
  });

  it('should search for an existing student with exams and show error if it does not exist', () => {
    let textInput: AbstractControl = component.searchForm.controls['ssid'];
    textInput.setValue("test-ssid");

    service.existsBySsid.and.returnValue(of(false));
    component.performSearch();

    expect(component.studentNotFound).toBe(true);
  });
});

class MockStudentExamHistoryService {
  public existsBySsid: Spy = jasmine.createSpy("existsBySsid");

  constructor() { }
}
