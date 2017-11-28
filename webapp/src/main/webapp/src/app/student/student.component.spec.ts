import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StudentComponent } from "./student.component";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "../shared/common.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, AbstractControl } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { Angulartics2Module } from 'angulartics2';
import { Observable } from "rxjs/Observable";
import Spy = jasmine.Spy;
import { Router } from "@angular/router";
import { MockRouter } from "../../test/mock.router";

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let service: MockStudentExamHistoryService;
  let router: MockRouter;

  beforeEach(async(() => {
    service = new MockStudentExamHistoryService();
    router = new MockRouter();
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
        Angulartics2Module
      ],
      declarations: [ StudentComponent ],
      providers: [
        StudentExamHistoryService, {
          provide: StudentExamHistoryService,
          useValue: service
        }, {
          provide: Router,
          useValue: router
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

    service.existsBySsid.and.returnValue(Observable.of({id: 123}));
    component.performSearch();

    expect(service.existsBySsid.calls.first().args[0]).toBe("test-ssid");
    expect(router.navigateByUrl.calls.first().args[0]).toBe("/students/123");
    expect(component.studentNotFound).toBe(false);
  });

  it('should search for an existing student with exams and show error if it does not exist', () => {
    let textInput: AbstractControl = component.searchForm.controls['ssid'];
    textInput.setValue("test-ssid");

    service.existsBySsid.and.returnValue(Observable.of(false));
    component.performSearch();

    expect(component.studentNotFound).toBe(true);
  });
});

class MockStudentExamHistoryService {
  public existsBySsid: Spy = jasmine.createSpy("existsBySsid");

  constructor() { }
}
