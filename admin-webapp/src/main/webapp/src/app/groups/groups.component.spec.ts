import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupsComponent } from "./groups.component";
import { CommonModule } from "../shared/common.module";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { GroupsModule } from "./groups.module";
import { School } from "./model/school.model";
import { GroupService } from "./groups.service";
import { Observable, Observer } from "rxjs";
import { MockRouter } from "../../test/mock.router";
import { Group } from "./model/group.model";
import { UserService } from "../user/user.service";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let mockGroupService = {
    getGroups: function () {
      return Observable.of([])
    }
  };
  let filterOptions: GroupFilterOptions;
  let mockRouteSnapshot;
  let paramsObserver: Observer<any>;
  let mockParams = new Observable<any>(observer => paramsObserver = observer);

  beforeEach(async(() => {
    mockParams = new Observable<{}>(observer => paramsObserver = observer);

    filterOptions = new GroupFilterOptions();

    filterOptions.schoolYears = [ 2017 ];
    filterOptions.schools = [ new School() ];
    filterOptions.subjects = [ "ALL", "MATH" ];

    mockRouteSnapshot = {
      params: {},
      data: { filterOptions: filterOptions }
    };

    TestBed.configureTestingModule({
      imports: [ CommonModule, GroupsModule, DropdownModule, BrowserAnimationsModule ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: mockRouteSnapshot, params: mockParams }
        },
        { provide: GroupService, useValue: mockGroupService },
        { provide: Router, useValue: MockRouter },
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set query params', () => {
    let school = new School();
    school.id = 1;
    school.name = "Test1";

    filterOptions.schools.push(school);

    paramsObserver.next({
      schoolId: 1,
      subject: "MATH",
      schoolYear: 2017
    });

    fixture.detectChanges();
    expect(component.query.school).toBe(school);
    expect(component.query.subject).toBe("MATH");
    expect(component.query.schoolYear).toBe(2017);
  });

  it('should default to first when no params are set', () => {
    paramsObserver.next({});

    fixture.detectChanges();
    expect(component.query.school).toBe(filterOptions.schools[ 0 ]);
    expect(component.query.subject).toBe(filterOptions.subjects[ 0 ]);
    expect(component.query.schoolYear).toBe(filterOptions.schoolYears[ 0 ]);
  });

  it('should default to first when params are not found', () => {
    paramsObserver.next({
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
    return Observable.of(true);
  }
}
