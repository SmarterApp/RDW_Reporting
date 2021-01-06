import { ReportingEmbargoService } from './reporting-embargo.service';
import { MockDataService } from '../../../test/mock.data.service';
import { MockUserService } from '../../../test/mock.user.service';
import { inject, TestBed } from '@angular/core/testing';
import { CachingDataService } from '../data/caching-data.service';
import { of } from 'rxjs';
import { ApplicationSettingsService } from '../../app-settings.service';
import { UserService } from '../security/service/user.service';
import { User } from '../security/state/user';

xdescribe('ReportingEmbargoService', () => {
  let service: ReportingEmbargoService;
  let dataService: MockDataService;
  let userService: MockUserService;
  let user: User;
  let mockSettingsService: ApplicationSettingsService;

  beforeEach(() => {
    mockSettingsService = jasmine.createSpyObj('ApplicationSettingsService', {
      getSettings: of({ schoolYear: 100 })
    });

    dataService = new MockDataService();
    dataService.get.and.returnValue(of(true));

    user = { firstName: 'first', lastName: 'last', permissions: [] };
    userService = new MockUserService();
    userService.getUser.and.callFake(() => of(user));

    TestBed.configureTestingModule({
      providers: [
        ReportingEmbargoService,
        { provide: ApplicationSettingsService, useValue: mockSettingsService },
        { provide: CachingDataService, useValue: dataService },
        { provide: UserService, useValue: userService }
      ]
    });
  });

  beforeEach(inject(
    [ReportingEmbargoService],
    (injectedSvc: ReportingEmbargoService) => {
      service = injectedSvc;
    }
  ));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return embargoed if user has read permissions and embargo is enabled', done => {
    user.permissions.push('EMBARGO_READ');

    service.isEmbargoed(100, -1).subscribe(embargo => {
      expect(embargo).toEqual({ Loading: true, Reviewing: true });
      done();
    });
  });
});
