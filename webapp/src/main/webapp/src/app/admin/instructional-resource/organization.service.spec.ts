import { OrganizationService } from "./organization.service";
import { Observable } from "rxjs/Observable";
import { OrganizationQuery } from "./model/organization-query.model";
import { Organization } from "./model/organization.model";
import { MockDataService } from "../../../test/mock.data.service";
import { of } from 'rxjs/observable/of';

describe("Organization Service", () => {
  let dataService: MockDataService;
  let service: OrganizationService;

  beforeEach(() => {
    dataService = new MockDataService();
    service = new OrganizationService(dataService as any);
  });

  it("should find organizations", (done) => {
    dataService.get.and.returnValue(of([apiOrganization(1), apiOrganization(2)]));

    let query: OrganizationQuery = new OrganizationQuery();
    query.types = ["type 1", "type 2"];
    query.limit = 123;
    query.name = "name";

    service.find(query)
      .subscribe((organizations: Organization[]) => {
        let dataArgs: any[] = dataService.get.calls.first().args;
        expect(dataArgs[0]).toEqual("/admin-service/organizations");
        expect(dataArgs[1]).toEqual({params: query});

        expect(organizations.length).toBe(2);
        expect(organizations[0].id).toBe(1);
        expect(organizations[0].name).toBe("name 1");
        expect(organizations[0].organizationType).toBe("type 1");
        expect(organizations[0].naturalId).toBe("natural id 1");
        expect(organizations[1].id).toBe(2);

        done();
      });
  });

  let apiOrganization = function(id: number) {
    return {
      id: id,
      name: `name ${id}`,
      organizationType: `type ${id}`,
      naturalId: `natural id ${id}`
    }
  }
});
