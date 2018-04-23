import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { SchoolResultsComponent } from "./school-results.component";
import { CommonModule } from "../../shared/common.module";
import { SchoolService } from "../school.service";
import { SchoolService as CommonSchoolService } from "../../shared/school/school.service";
import { SchoolAssessmentService } from "./school-assessment.service";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { Angulartics2 } from "angulartics2";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { UserService } from "../../user/user.service";
import { MockUserService } from "../../../test/mock.user.service";
import { MockDataService } from "../../../test/mock.data.service";
import { MockRouter } from "../../../test/mock.router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockAuthorizeDirective } from "../../../test/mock.authorize.directive";
import { MockTranslateService } from "../../../test/mock.translate.service";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "../../shared/data/data.service";
import { DefaultSchool, School } from "../../shared/organization/organization";
import { SchoolAssessmentExportService } from "./school-assessment-export.service";
import { of } from 'rxjs/observable/of';
import { OrganizationService } from "../../shared/organization/organization.service";
import { MockActivatedRoute } from '../../shared/test/mock.activated-route';

let availableGrades = [];
let schools = [];

describe('SchoolResultsComponent', () => {
  let component: SchoolResultsComponent;
  let fixture: ComponentFixture<SchoolResultsComponent>;
  let exportService: any;
  let mockRouter: MockRouter;
  let route: MockActivatedRoute;
  let school = new DefaultSchool();
  school.id = 1;
  let schoolYear: number = 2017;

  beforeEach(async(() => {

    const school = new DefaultSchool();
    school.id = 2;
    school.name = 'Ogden';
    school.districtId = 0;
    school.districtName = 'Test District';

    const user = {
      firstName: 'first',
      lastName: 'last',
      permissions: []
    };

    const mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = { user: user };
    mockRouteSnapshot.params = { schoolId: 2, schoolYear: schoolYear };

    mockRouter = new MockRouter();

    route = new MockActivatedRoute();
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    const mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

    const mockTranslate = new MockTranslateService();

    const mockAssessmentService = jasmine.createSpyObj('SchoolAssessmentService', [ 'findGradesWithAssessmentsForSchool' ]);

    const mockAssessmentExportService = jasmine.createSpyObj('SchoolAssessmentExportService', [ 'exportItemsToCsv', 'exportWritingTraitScoresToCsv' ]);

    const mockOrganizationService = jasmine.createSpyObj('OrganizationService', [ 'getSchoolsWithDistricts' ]);

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
        { provide: SchoolAssessmentExportService, useValue: mockAssessmentExportService },
        { provide: DataService, useClass: MockDataService },
        { provide: ExamFilterOptionsService, useClass: MockExamFilterOptionService },
        { provide: SchoolService, useClass: MockSchoolService },
        { provide: CommonSchoolService, useClass: MockCommonSchoolService },
        { provide: OrganizationService, useValue: new MockOrganizationService() },
        { provide: ActivatedRoute, useValue: route },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: CsvExportService, useValue: exportService },
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useValue: mockRouter },
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
      [ 'schools', school.id, { schoolYear: schoolYear, gradeId: 4 } ]
    );
  });

  it('should default to the first available grade if it is not available on school change', () => {
    availableGrades = [ { code: "03", id: 3 }, { code: "04", id: 4 }, { code: "05", id: 5 } ];

    component.currentGrade = { code: "11", id: 11 };
    component.schoolSelectChanged(school);

    expect(component.currentGrade.id).toBe(3);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [ 'schools', school.id, { schoolYear: schoolYear, gradeId: 3 } ]
    );
  });

  it('should unselect a grade when no grades are available.', () => {
    availableGrades = [];

    component.currentGrade = { code: "11", id: 11 };
    component.schoolSelectChanged(school);

    expect(component.currentGrade).toBeUndefined();
    expect(component.assessmentExams).toEqual([]);
    expect(component.gradesAreUnavailable).toEqual(true);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  });
});

class MockSchoolService {
  findGradesWithAssessmentsForSchool(school: School) {
    return of(availableGrades);
  }
}

class MockCommonSchoolService {
  getSchool(schoolId: number, limit?: number) {
    return of(schools)
  }
}

class MockOrganizationService {
  getSchoolsWithDistricts(): Observable<School[]> {
    return of([]);
  }
}

class MockExamFilterOptionService {
  getExamFilterOptions() {
    return of(new ExamFilterOptions());
  }
}
