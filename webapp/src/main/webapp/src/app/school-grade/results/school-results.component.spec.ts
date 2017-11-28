import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { SchoolResultsComponent } from "./school-results.component";
import { CommonModule } from "../../shared/common.module";
import { SchoolService } from "../school.service";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { SchoolAssessmentService } from "./school-assessment.service";
import { User } from "../../user/model/user.model";
import { School } from "../../user/model/school.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { Angulartics2 } from "angulartics2";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { UserService } from "../../user/user.service";
import { MockUserService } from "../../../test/mock.user.service";
import { MockActivatedRoute } from "../../../test/mock.activated-route";
import { OrganizationService } from "../organization.service";
import { MockDataService } from "../../../test/mock.data.service";
import { MockRouter } from "../../../test/mock.router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockAuthorizeDirective } from "../../../test/mock.authorize.directive";
import { MockTranslateService } from "../../../test/mock.translate.service";
import { TranslateService } from "@ngx-translate/core";

let availableGrades = [];

describe('SchoolResultsComponent', () => {
  let component: SchoolResultsComponent;
  let fixture: ComponentFixture<SchoolResultsComponent>;
  let exportService: any;
  let mockRouter: MockRouter;
  let route: MockActivatedRoute;
  let school = new School();
  school.id = 1;
  let schoolYear: number = 2017;

  beforeEach(async(() => {
    let user = new User();
    user.schools = [ { name: "Ogden", id: 2, districtId: 0, districtName: "Test District" } ];

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = { user: user };
    mockRouteSnapshot.params = { schoolId: 2, schoolYear: schoolYear };

    mockRouter = new MockRouter();

    route = new MockActivatedRoute();
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

    let mockTranslate = new MockTranslateService();

    let mockAssessmentService = jasmine.createSpyObj('SchoolAssessmentService', ['findGradesWithAssessmentsForSchool']);

    let mockOrganizationService = jasmine.createSpyObj('OrganizationService', ['getSchoolsWithDistricts']);

    availableGrades = [];
    exportService = {};

    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        SchoolResultsComponent,
        MockAuthorizeDirective
      ],
      providers: [
        { provide: OrganizationService, useValue: mockOrganizationService },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: SchoolAssessmentService, useValue: mockAssessmentService },
        { provide: DataService, useClass: MockDataService },
        { provide: ExamFilterOptionsService, useClass: MockExamFilterOptionService },
        { provide: SchoolService, useClass: MockSchoolService },
        { provide: OrganizationService, useValue: new MockOrganizationService(user.schools)},
        { provide: ActivatedRoute, useValue: route },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: CsvExportService, useValue: exportService },
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useValue: mockRouter},
        { provide: TranslateService, useValue: mockTranslate }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
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
    component.schoolSelectChanged(school);

    expect(component.currentGrade.id).toBe(4);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [ 'schools', school.id, {schoolYear: schoolYear, gradeId: 4} ]
    );
  });

  it('should default to the first available grade if it is not available on school change', () => {
    availableGrades = [ { code: "03", id: 3 }, { code: "04", id: 4 }, { code: "05", id: 5 } ];

    component.currentGrade = { code: "11", id: 11 };
    component.schoolSelectChanged(school);

    expect(component.currentGrade.id).toBe(3);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [ 'schools', school.id, {schoolYear: schoolYear, gradeId: 3} ]
    );
  });

  it('should unselect a grade when no grades are available.', () => {
    availableGrades = [];

    component.currentGrade = { code: "11", id: 11 };
    component.schoolSelectChanged(school);

    expect(component.currentGrade).toBeUndefined();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [ 'schools', school.id, {schoolYear: schoolYear} ]
    );
  });
});

class MockSchoolService {
  findGradesWithAssessmentsForSchool(school: School) {
    return Observable.of(availableGrades);
  }
}

class MockOrganizationService {

  constructor(private schools: School[]){
  }

  getSchoolsWithDistricts(): Observable<School[]> {
    return Observable.of(this.schools);
  }
}

class MockExamFilterOptionService {
  getExamFilterOptions() {
    return Observable.of(new ExamFilterOptions());
  }
}
