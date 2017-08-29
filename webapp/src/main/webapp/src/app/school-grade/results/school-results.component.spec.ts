import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { SharedModule } from "primeng/components/common/shared";
import { BrowserModule } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { RequestOptionsArgs } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { SchoolResultsComponent } from "./school-results.component";
import { AssessmentsModule } from "../../assessments/assessments.module";
import { CommonModule } from "../../shared/common.module";
import { SchoolService } from "../school.service";
import { DataService } from "../../shared/data/data.service";
import { SchoolAssessmentService } from "./school-assessment.service";
import { User } from "../../user/model/user.model";
import { School } from "../../user/model/school.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { Angulartics2Module, Angulartics2 } from "angulartics2";
import { PopoverModule, TypeaheadModule } from "ngx-bootstrap";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { UserService } from "../../user/user.service";
import { MockUserService } from "../../../test/mock.user.service";
import { ReportModule } from "../../report/report.module";
import { MockActivatedRoute } from "../../../test/mock.activated-route";
import { SchoolSelectComponent } from "../school-select/school-select.component";

let availableGrades = [];

describe('SchoolResultsComponent', () => {
  let component: SchoolResultsComponent;
  let fixture: ComponentFixture<SchoolResultsComponent>;
  let exportService: any;
  let route: MockActivatedRoute;

  beforeEach(async(() => {
    let user = new User();
    user.schools = [ { name: "Ogden", id: 2, districtId: 0, districtName: "Test District" } ];

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = { user: user };
    mockRouteSnapshot.params = { schoolId: 2 };

    route = new MockActivatedRoute();
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

    availableGrades = [];
    exportService = {};

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AssessmentsModule,
        TypeaheadModule,
        DropdownModule,
        SharedModule,
        Angulartics2Module,
        PopoverModule.forRoot(),
        ReportModule
      ],
      declarations: [ SchoolResultsComponent, SchoolSelectComponent ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: MockRouter },
        SchoolAssessmentService,
        { provide: DataService, useClass: MockDataService },
        { provide: ExamFilterOptionsService, useClass: MockExamFilterOptionService },
        { provide: SchoolService, useClass: MockSchoolService },
        {
          provide: ActivatedRoute,
          useValue: route
        },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: CsvExportService, useValue: exportService },
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should init if school is null', () => {
    route.snapshot.params[ "schoolId" ] = 212122;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should try to keep grade if it is available on school change', () => {
    availableGrades = [ { code: "03", id: 3 }, { code: "04", id: 4 }, { code: "05", id: 5 } ];

    component.currentGrade = { code: "04", id: 4 };
    component.schoolSelectChanged(new School());

    expect(component.currentGrade.id).toBe(4);
  });

  it('should default to the first available grade if it is not available on school change', () => {
    availableGrades = [ { code: "03", id: 3 }, { code: "04", id: 4 }, { code: "05", id: 5 } ];

    component.currentGrade = { code: "11", id: 11 };
    component.schoolSelectChanged(new School());

    expect(component.currentGrade.id).toBe(3);
  });

  it('should unselect a grade when no grades are available.', () => {
    availableGrades = [];

    component.currentGrade = { code: "11", id: 11 };
    component.schoolSelectChanged(new School());

    expect(component.currentGrade).toBeUndefined();
  });
});


class MockDataService {
  get(url, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of({});
  }
}

class MockSchoolService {
  findGradesWithAssessmentsForSchool(school: School) {
    return Observable.of(availableGrades);
  }
}

class MockRouter {
  navigate(params: any[]) {
    return Observable.empty().toPromise();
  }
}

class MockExamFilterOptionService {
  getExamFilterOptions() {
    return Observable.of(new ExamFilterOptions());
  }
}
