import { ReportingEmbargoService } from "./reporting-embargo.service";
import { MockDataService } from "../../../test/mock.data.service";
import { MockUserService } from "../../../test/mock.user.service";
import { User } from "../../user/user";
import { inject, TestBed } from "@angular/core/testing";
import { CachingDataService } from "../data/caching-data.service";
import { UserService } from "../../user/user.service";
import { of } from 'rxjs/observable/of';

describe('ReportingEmbargoService', () => {
  let service: ReportingEmbargoService;
  let dataService: MockDataService;
  let userService: MockUserService;
  let user: User;

  beforeEach(() => {
    dataService = new MockDataService();
    dataService.get.and.returnValue(of(true));

    user = {firstName: "first", lastName: "last", permissions: []};
    userService = new MockUserService();
    userService.getUser.and.callFake(() => of(user));

    TestBed.configureTestingModule({
      providers: [
        ReportingEmbargoService,
        { provide: CachingDataService, useValue: dataService },
        { provide: UserService, useValue: userService }
      ]
    });
  });

  beforeEach(inject([ ReportingEmbargoService ], (injectedSvc: ReportingEmbargoService) => {
    service = injectedSvc;
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return embargoed if user has read permissions and embargo is enabled', (done) => {
    user.permissions.push("EMBARGO_READ");

    service.isEmbargoed().subscribe(
      embargoed => {
        expect(embargoed).toBe(true);
        done();
      }
    )
  });

  it('should not return embargoed if user does not have read permissions', (done) => {
    service.isEmbargoed().subscribe(
      embargoed => {
        expect(embargoed).toBe(false);
        expect(dataService.get).not.toHaveBeenCalled();
        done();
      }
    )
  });

  it('should not return embargoed if embargo is disabled', (done) => {
    user.permissions.push("EMBARGO_READ");
    dataService.get.and.returnValue(of(false));

    service.isEmbargoed().subscribe(
      embargoed => {
        expect(embargoed).toBe(false);
        expect(dataService.get).toHaveBeenCalled();
        done();
      }
    )
  });
});
