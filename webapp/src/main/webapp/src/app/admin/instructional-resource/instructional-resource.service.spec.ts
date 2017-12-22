import { InstructionalResourceService } from "./instructional-resource.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";
import { InstructionalResource } from "./model/instructional-resource.model";
import { MockDataService } from "../../../test/mock.data.service";

describe("Instructional Resource Service", () => {
  let dataService: MockDataService;
  let service: InstructionalResourceService;

  beforeEach(() => {
    dataService = new MockDataService();
    service = new InstructionalResourceService(dataService as any);
  });

  it("should find instructional resources", (done) => {
    dataService.get.and.returnValue(Observable.of([apiResource(1), apiResource(2)]));

    service.findAll()
      .subscribe((resources: InstructionalResource[]) => {
        let dataArgs: any[] = dataService.get.calls.first().args;
        expect(dataArgs[0]).toEqual("/admin-service/instructional-resources");

        expect(resources.length).toBe(2);
        expect(resources[0].organizationId).toBe(1);
        expect(resources[0].organizationName).toBe("org name 1");
        expect(resources[0].organizationType).toBe("org type 1");
        expect(resources[0].assessmentLabel).toBe("asmt label 1");
        expect(resources[0].assessmentName).toBe("asmt name 1");
        expect(resources[0].assessmentType).toBe("asmt type 1");
        expect(resources[0].performanceLevel).toBe(1);
        expect(resources[0].resource).toBe("resource 1");
        expect(resources[1].organizationId).toBe(2);

        done();
      });
  });

  it("should create an instructional resource", (done) => {
    dataService.post.and.callFake(() => {
      return Observable.of(apiResource(1));
    });

    let newResource: InstructionalResource = modelResource(1);
    service.create(newResource)
      .subscribe(response => {
        let dataArgs: any[] = dataService.post.calls.first().args;
        expect(dataArgs[0]).toEqual("/admin-service/instructional-resources");
        expect(dataArgs[1]).toBe(newResource);

        expect(response).toEqual(newResource);
        done();
      });
  });

  it("should update an instructional resource", (done) => {
    dataService.put.and.callFake(() => {
      return Observable.of(apiResource(1));
    });

    let updatedResource: InstructionalResource = modelResource(1);
    service.update(updatedResource)
      .subscribe(response => {
        let dataArgs: any[] = dataService.put.calls.first().args;
        expect(dataArgs[0]).toEqual("/admin-service/instructional-resources");
        expect(dataArgs[1]).toBe(updatedResource);

        expect(response).toEqual(updatedResource);
        done();
      });
  });

  it("should delete an instructional resource", (done) => {
    dataService.delete.and.callFake(() => {
      return Observable.empty();
    });

    let deletedResource: InstructionalResource = modelResource(1);
    service.delete(deletedResource)
      .subscribe(() => {
      }, () => {
      }, () => {
        let dataArgs: any[] = dataService.delete.calls.first().args;
        expect(dataArgs[0]).toEqual("/admin-service/instructional-resources");
        expect(dataArgs[1]).toEqual({params: deletedResource});

        done();
      });
  });

  let apiResource = function(id: number): any {
    return {
      organizationId: id,
      organizationName: `org name ${id}`,
      organizationType: `org type ${id}`,
      assessmentLabel: `asmt label ${id}`,
      assessmentName: `asmt name ${id}`,
      assessmentType: `asmt type ${id}`,
      performanceLevel: id,
      resource: `resource ${id}`
    }
  };

  let modelResource = function(id: number): InstructionalResource {
    let resource: InstructionalResource = new InstructionalResource();
    resource.organizationId = id;
    resource.organizationName = `org name ${id}`;
    resource.organizationType = `org type ${id}`;
    resource.assessmentLabel = `asmt label ${id}`;
    resource.assessmentName = `asmt name ${id}`;
    resource.assessmentType = `asmt type ${id}`;
    resource.performanceLevel = id;
    resource.resource = `resource ${id}`;
    return resource;
  };
});
