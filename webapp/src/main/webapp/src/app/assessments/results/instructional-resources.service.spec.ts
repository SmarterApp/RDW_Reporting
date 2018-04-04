import { InstructionalResourcesService } from './instructional-resources.service';
import { MockDataService } from '../../../test/mock.data.service';
import { InstructionalResource, InstructionalResources } from '../model/instructional-resources.model';
import { of } from 'rxjs/observable/of';

describe('InstructionalResourcesService', () => {

  let mockDataService: MockDataService;
  let service: InstructionalResourcesService;

  beforeEach(() => {
    mockDataService = new MockDataService();
    service = new InstructionalResourcesService(mockDataService as any);
  });

  it('should map api instructional resources to model instances', (done) => {
    mockDataService.get.and.returnValue(of([
      resource('district-a', 0),
      resource('district-a', 1),
      resource('district-b', 0)
    ]));
    service.getInstructionalResources(1, 2)
      .subscribe((result: InstructionalResources) => {
        expect(result.getResourcesByPerformance(0).length).toBe(2);
        expect(result.getResourcesByPerformance(1).length).toBe(1);
        expect(result.getResourcesByPerformance(2).length).toBe(0);

        const expectedResource = new InstructionalResource();
        expectedResource.organizationName = 'Org district-a';
        expectedResource.organizationLevel = 'District';
        expectedResource.performanceLevel = '1';
        expectedResource.url = 'http://district-a/';

        expect(result.getResourcesByPerformance(1)).toEqual([ expectedResource ]);
        done();
      });

    expect(mockDataService.get.calls.first().args).toEqual([
      '/reporting-service/instructional-resources',
      {
        params: {
          assessmentId: 1,
          schoolId: 2
        }
      }
    ]);
  });

  function resource(name: string, performanceLevel: number): any {
    return {
      organizationLevel: 'District',
      organizationName: `Org ${name}`,
      performanceLevel: performanceLevel,
      resource: `http://${name}/`
    };
  }
});
