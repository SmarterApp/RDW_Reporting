import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StudentComponent } from "./student.component";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "../shared/common.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, AbstractControl } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { Observable } from "rxjs";
import Spy = jasmine.Spy;

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let service: MockStudentExamHistoryService;

  beforeEach(async(() => {
    service = new MockStudentExamHistoryService();
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [ StudentComponent ],
      providers: [
        StudentExamHistoryService, {
          provide: StudentExamHistoryService,
          useValue: service
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for an existing student with exams and navigate if it exists', () => {
    let textInput: AbstractControl = component.searchForm.controls['ssid'];
    textInput.setValue("test-ssid");

    service.existsById.and.returnValue(Observable.of(true));
    component.performSearch();

    expect(service.existsById.calls.first().args[0]).toBe("test-ssid");
    expect(component.studentNotFound).toBe(false);
  });

  it('should search for an existing student with exams and show error if it does not exist', () => {
    let textInput: AbstractControl = component.searchForm.controls['ssid'];
    textInput.setValue("test-ssid");

    service.existsById.and.returnValue(Observable.of(false));
    component.performSearch();

    expect(component.studentNotFound).toBe(true);
  });
});

class MockStudentExamHistoryService {
  public existsById: Spy = jasmine.createSpy("existsById");

  constructor() { }
}
