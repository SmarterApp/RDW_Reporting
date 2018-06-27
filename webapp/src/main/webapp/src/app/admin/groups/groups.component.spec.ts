import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupsComponent } from "./groups.component";
import { ActivatedRoute } from "@angular/router";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { School } from "./model/school.model";
import { GroupService } from "./groups.service";
import { Observable } from "rxjs/Observable";
import { Group } from "./model/group.model";
import { CommonModule } from "../../shared/common.module";
import { of } from 'rxjs/observable/of';
import { EventEmitter, NO_ERRORS_SCHEMA } from "@angular/core";
import { BsModalService } from "ngx-bootstrap";
import { TestModule } from "../../../test/test.module";
import { MockActivatedRoute } from '../../shared/test/mock.activated-route';
import { SubjectService } from '../../subject/subject.service';

let mockFilterOptionsProvider = { options: new GroupFilterOptions() };

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let mockGroupService = {
    getFilterOptions() {
      return of(mockFilterOptionsProvider.options);
    },
    getGroups: function () {
      return of([]);
    }
  };
  let filterOptions: GroupFilterOptions;
  let mockActivatedRoute: MockActivatedRoute;
  let mockModalService: any;

  const mockSubjectService = jasmine.createSpyObj('SubjectService', [ 'getSubjectCodes' ]);
  mockSubjectService.getSubjectCodes.and.callFake(() => of(['Math']));

  beforeEach(async(() => {
    mockModalService = jasmine.createSpyObj("BsModalService", ["show"]);
    mockModalService.onHidden = new EventEmitter();

    filterOptions = new GroupFilterOptions();

    filterOptions.schoolYears = [ 2017 ];
    filterOptions.schools = [ new School() ];

    mockFilterOptionsProvider.options = filterOptions;

    TestBed.configureTestingModule({
      declarations: [
        GroupsComponent
      ],
      imports: [
        CommonModule,
        TestModule
      ],
      providers: [
        { provide: BsModalService, useValue: mockModalService },
        { provide: GroupService, useValue: mockGroupService },
        { provide: SubjectService, useValue: mockSubjectService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  function createComponent() {
    fixture = TestBed.createComponent(GroupsComponent);
    mockActivatedRoute = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should be created', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should set query params', () => {

    let school = new School();
    school.id = 1;
    school.name = "Test1";

    mockFilterOptionsProvider.options.schools = [ school ];

    createComponent();

    mockActivatedRoute.params.emit({
      schoolId: 1,
      subject: "Math",
      schoolYear: 2017
    });

    fixture.detectChanges();
    expect(component.query.school).toBe(school);
    expect(component.query.subject).toBe("Math");
    expect(component.query.schoolYear).toBe(2017);
  });

  it('should default to first when no params are set', () => {
    createComponent();
    mockActivatedRoute.params.emit({});

    fixture.detectChanges();
    expect(component.query.school).toBe(filterOptions.schools[ 0 ]);
    expect(component.query.subject).toBe(filterOptions.subjects[ 0 ]);
    expect(component.query.schoolYear).toBe(filterOptions.schoolYears[ 0 ]);
  });

  it('should default to first when params are not found', () => {
    createComponent();
    mockActivatedRoute.params.emit({
      schoolId: -1,
      subject: "INVALID_SUBJECT",
      schoolYear: 2099
    });

    fixture.detectChanges();
    expect(component.query.school).toBe(filterOptions.schools[ 0 ]);
    expect(component.query.subject).toBe(filterOptions.subjects[ 0 ]);
    expect(component.query.schoolYear).toBe(filterOptions.schoolYears[ 0 ]);
  });

  it('should filter groups on name', () => {
    createComponent();
    component.groups = [ "Test2", "test3", "TEST1", "NotInResult1", "NotInResult2" ].map(x => {
      let group = new Group();
      group.name = x;
      return group;
    });

    component.searchTerm = "test";
    component.updateFilteredGroups();
    expect(component.filteredGroups.length).toBe(3);
  });
});

class MockUserService {

  doesCurrentUserHaveAtLeastOnePermission(permissions: string[]): Observable<boolean> {
    return of(true);
  }

}
