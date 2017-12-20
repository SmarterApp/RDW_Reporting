import { InstructionalResourcesService } from "./instructional-resources.service";
import { MockDataService } from "../../../test/mock.data.service";
import { Observable } from "rxjs/Observable";
import { InstructionalResource, InstructionalResources } from "../model/instructional-resources.model";
import { URLSearchParams } from '@angular/http';

describe('InstructionalResourcesService', () => {

  let mockDataService: MockDataService;
  let service: InstructionalResourcesService;

  beforeEach(() => {
    mockDataService = new MockDataService();
    service = new InstructionalResourcesService(mockDataService as any);
  });

  it('should map api instructional resources to model instances', (done) => {
    mockDataService.get.and.returnValue(Observable.of([
      resource("district-a", 0),
      resource("district-a", 1),
      resource("district-b", 0)
    ]));
    service.getInstructionalResources(1, 2)
      .subscribe((result: InstructionalResources) => {
        expect(result.getResourcesByPerformance(0).length).toBe(2);
        expect(result.getResourcesByPerformance(1).length).toBe(1);
        expect(result.getResourcesByPerformance(2).length).toBe(0);

        let resource: InstructionalResource = result.getResourcesByPerformance(1)[0];
        expect(resource.organizationLevel).toBe("District");
        expect(resource.performanceLevel).toBe("1");
        expect(resource.organizationName).toBe("Org district-a");
        expect(resource.url).toBe("http://district-a/");
        done();
      });

    expect(mockDataService.get.calls.first().args[0]).toBe("/reporting-service/instructional-resources");

    let expectedParams: URLSearchParams = new URLSearchParams();
    expectedParams.set('assessmentId', "1");
    expectedParams.set('schoolId', "2");
    expect(mockDataService.get.calls.first().args[1]).toEqual({
      params: expectedParams
    });
  });

  it('should cache api responses', (done) => {
    mockDataService.get.and.returnValue(Observable.of([
      resource("district-a", 0),
      resource("district-a", 1),
      resource("district-b", 0)
    ]));
    let result1_2: Observable<InstructionalResources> = service.getInstructionalResources(1, 2);
    let result3_4: Observable<InstructionalResources> = service.getInstructionalResources(3, 4);
    Observable.forkJoin(result1_2, result3_4).subscribe((value) => {
      expect(mockDataService.get.calls.all().length).toBe(2);

      let cachedResult1_2: Observable<InstructionalResources> = service.getInstructionalResources(1, 2);
      let cachedResult3_4: Observable<InstructionalResources> = service.getInstructionalResources(3, 4);
      Observable.forkJoin(cachedResult1_2, cachedResult3_4)
        .subscribe(() => {
          //Expect no additional calls to the dataservice
          expect(mockDataService.get.calls.all().length).toBe(2);
          done();
        });
    });

  });

  let resource = function(name: string, performanceLevel: number) {
    return {
      organizationLevel: "District",
      organizationName: `Org ${name}`,
      performanceLevel: performanceLevel,
      resource: `http://${name}/`
    }
  }
});
