import { EmbargoService } from './embargo.service';
import { MockDataService } from '../../../test/mock.data.service';
import { inject, TestBed } from '@angular/core/testing';
import { DataService } from '../../shared/data/data.service';
import { Embargo } from './embargo';
import { OrganizationType, State } from '../../shared/organization/organization';
import { of } from 'rxjs/observable/of';

describe('EmbargoService', () => {
  let service: EmbargoService;
  let dataService: MockDataService;

  beforeEach(() => {
    dataService = new MockDataService();

    TestBed.configureTestingModule({
      providers: [
        EmbargoService,
        { provide: DataService, useValue: dataService }
      ]
    });
  });

  beforeEach(inject([ EmbargoService ], (injectedSvc: EmbargoService) => {
    service = injectedSvc;
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve embargo information by organization type', (done) => {
    const apiEmbargoData: any[] = [ apiEmbargo('State'), apiEmbargo('District') ];
    dataService.get.and.returnValue(of(apiEmbargoData));

    service.getEmbargoesByOrganizationType().subscribe((result: Map<OrganizationType, Embargo[]>) => {
      expect(result.size).toBe(2);
      expect(result.get(OrganizationType.State).length).toBe(1);
      expect(result.get(OrganizationType.District).length).toBe(1);

      const state: Embargo = result.get(OrganizationType.State)[ 0 ];
      expect(state.organization.type).toBe(OrganizationType.State);
      expect(state.organization.id).toBeUndefined();
      expect(state.organization.name).toBe('Organization State');
      expect(state.schoolYear).toBe(2018);
      expect(state.readonly).toBe(false);
      expect(state.examCountsBySubject.subject1).toBe(123);
      expect(state.examCountsBySubject.subject2).toBe(456);
      expect(state.individualEnabled).toBe(true);
      expect(state.individualEnabled).toBe(true);

      const district: Embargo = result.get(OrganizationType.District)[ 0 ];
      expect(district.organization.type).toBe(OrganizationType.District);
      expect(district.organization.id).toBe(123);
      expect(district.organization.name).toBe('Organization District');

      done();
    });
  });

  function apiEmbargo(type: string): any {
    return {
      organizationType: type,
      organizationName: 'Organization ' + type,
      organizationId: type == 'State' ? undefined : 123,
      schoolYear: 2018,
      readOnly: false,
      individualEnabled: true,
      aggregateEnabled: true,
      examCounts: {
        subject1: 123,
        subject2: 456
      }
    };
  }
});
