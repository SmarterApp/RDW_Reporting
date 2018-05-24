import { InstructionalResourceService } from './instructional-resource.service';
import { InstructionalResource } from './model/instructional-resource.model';
import { MockDataService } from '../../../test/mock.data.service';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';

describe('Instructional Resource Service', () => {
  let dataService: MockDataService;
  let service: InstructionalResourceService;

  beforeEach(() => {
    dataService = new MockDataService();
    service = new InstructionalResourceService(dataService as any);
  });

  it('should find instructional resources', (done) => {
    dataService.get.and.returnValue(of([
      apiResource(1),
      apiResource(2)
    ]));

    service.findAll()
      .subscribe((resources: InstructionalResource[]) => {
        expect(dataService.get.calls.first().args).toEqual([
          '/admin-service/instructional-resources'
        ]);

        expect(resources).toEqual([
          modelResource(1),
          modelResource(2)
        ]);

        done();
      });
  });

  it('should create an instructional resource', (done) => {
    dataService.post.and.callFake(() => {
      return of(apiResource(1));
    });

    const newResource: InstructionalResource = modelResource(1);
    service.create(newResource)
      .subscribe(response => {
        expect(dataService.post.calls.first().args).toEqual([
          '/admin-service/instructional-resources',
          newResource
        ]);
        expect(response).toEqual(newResource);
        done();
      });
  });

  it('should update an instructional resource', (done) => {
    dataService.put.and.callFake(() => {
      return of(apiResource(1));
    });

    const updatedResource: InstructionalResource = modelResource(1);
    service.update(updatedResource)
      .subscribe(response => {
        expect(dataService.put.calls.first().args).toEqual([
          '/admin-service/instructional-resources',
          updatedResource
        ]);
        expect(response).toEqual(updatedResource);
        done();
      });
  });

  it('should delete an instructional resource', (done) => {
    dataService.delete.and.callFake(() => {
      return empty();
    });

    const deletedResource: InstructionalResource = modelResource(1);
    service.delete(deletedResource)
      .subscribe(() => {
      }, () => {
      }, () => {
        expect(dataService.delete.calls.first().args).toEqual([
          '/admin-service/instructional-resources',
          { params: deletedResource }
        ]);
        done();
      });
  });

  function apiResource(id: number): any {
    return {
      organizationId: id,
      organizationName: `org name ${id}`,
      organizationType: `org type ${id}`,
      assessmentLabel: `asmt label ${id}`,
      assessmentName: `asmt name ${id}`,
      assessmentType: `asmt type ${id}`,
      assessmentTypeCode: `asmt type code  ${id}`,
      performanceLevel: id,
      resource: `resource ${id}`
    };
  }

  function modelResource(id: number): InstructionalResource {
    const resource: InstructionalResource = new InstructionalResource();
    resource.organizationId = id;
    resource.organizationName = `org name ${id}`;
    resource.organizationType = `org type ${id}`;
    resource.assessmentLabel = `asmt label ${id}`;
    resource.assessmentName = `asmt name ${id}`;
    resource.assessmentType = `asmt type ${id}`;
    resource.performanceLevel = id;
    resource.resource = `resource ${id}`;
    return resource;
  }
});
