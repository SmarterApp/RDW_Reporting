
import { StudentResponsesComponent } from "./student-responses.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AssessmentsModule } from "../../assessments/assessments.module";
import { ActivatedRoute } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;
import { TranslateModule } from "@ngx-translate/core";

describe('StudentResponsesComponent', () => {
  let component: StudentResponsesComponent;
  let fixture: ComponentFixture<StudentResponsesComponent>;
  let route: MockActivatedRoute;

  beforeEach(() => {
    route = new MockActivatedRoute();

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = {};
    mockRouteSnapshot.params = {};
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    TestBed.configureTestingModule({
      imports: [
        AssessmentsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        StudentResponsesComponent
      ],
      providers: [ {
        provide: ActivatedRoute,
        useValue: route
      } ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

class MockActivatedRoute {
  snapshotResult: Spy = createSpy("snapshot");

  get snapshot(): any {
    return this.snapshotResult();
  }
}
