import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { CommonModule } from "../../shared/common.module";
import { User } from "../../user/model/user.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { Angulartics2 } from "angulartics2";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { MockActivatedRoute } from "../../../test/mock.activated-route";
import { GroupResultsComponent } from "./group-results.component";
import { GroupAssessmentService } from "./group-assessment.service";
import { UserModule } from "../../user/user.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockRouter } from "../../../test/mock.router";
import { MockAuthorizeDirective } from "../../../test/mock.authorize.directive";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

let availableGrades = [];

describe('GroupResultsComponent', () => {
  let component: GroupResultsComponent;
  let fixture: ComponentFixture<GroupResultsComponent>;
  let exportService: any;
  let route: MockActivatedRoute;

  beforeEach(async(() => {
    let user = new User();
    user.groups = [ { name: "Group 1", id: 2, schoolName: '', schoolId: 123, subjectCode: 'ELA' } ];

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = { user: user };
    mockRouteSnapshot.params = { groupId: 2 };

    route = new MockActivatedRoute();
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

    availableGrades = [];
    exportService = {};

    let mockGroupAssessmentService = {};

    let mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        UserModule
      ],
      declarations: [
        GroupResultsComponent,
        MockAuthorizeDirective
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: GroupAssessmentService, useValue: mockGroupAssessmentService },
        { provide: ExamFilterOptionsService, useClass: MockExamFilterOptionService },
        { provide: ActivatedRoute, useValue: route },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: CsvExportService, useValue: exportService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init if current group is null', () => {
    route.snapshot.params[ "groupId" ] = 2342;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

});

class MockExamFilterOptionService {
  getExamFilterOptions() {
    return Observable.of(new ExamFilterOptions());
  }
}
