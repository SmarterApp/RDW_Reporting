import { Observable } from "rxjs/Observable";
import { GroupService } from "./groups.service";
import { GroupQuery } from "./model/group-query.model";
import { School } from "./model/school.model";
import { DataService } from "../../shared/data/data.service";

let filterObserver;
let groupObserver;
let optionsSpy;

describe("Groups Service", () => {
  let service;

  beforeEach(() => {
    service = new GroupService(new MockDataService(null));
  });

  it('should map filter data and sort', () => {
    let mockApiResult = {
      schools: [
        { id: 1, name: "Everglenn" },
        { id: 2, name: "Coral Park" },
      ],
      subjects: [
        "Math"
      ],
      schoolYears: [ 2017, 2018 ]
    };

    service.getFilterOptions().subscribe(actual => {
      expect(actual.schools.length).toBe(2);
      expect(actual.schools[ 0 ].name).toBe("Coral Park");
      expect(actual.schools[ 1 ].name).toBe("Everglenn");

      expect(actual.schoolYears.length).toBe(2);
      expect(actual.schoolYears[ 0 ]).toBe(2018);
      expect(actual.schoolYears[ 1 ]).toBe(2017);

      expect(actual.subjects.length).toBe(2);
      expect(actual.subjects[ 0 ]).toBe("ALL");
      expect(actual.subjects[ 1 ]).toBe("MATH");

    });

    filterObserver.next(mockApiResult);
  });

  it('should set defaults when empty response', () => {
    let mockApiResult = {};

    service.getFilterOptions().subscribe(actual => {
      expect(actual.schools.length).toBe(0);

      expect(actual.schoolYears.length).toBe(1);
      expect(actual.schoolYears[ 0 ]).toBe(new Date().getFullYear());

      expect(actual.subjects.length).toBe(1);
      expect(actual.subjects[ 0 ]).toBe("ALL");
    });

    filterObserver.next(mockApiResult);
  });

  it('should map GroupQuery to params', () => {
    let school = new School();
    school.id = 1;

    let query = new GroupQuery([ "Math", "ELA" ]);
    query.subject = "Math";
    query.school = school;
    query.schoolYear = 2017;

    let mockApiResult = [ {
        id: 122,
        name: "Group1",
        schoolName: "Springfield",
        schoolYear: "2017",
        subject: undefined,
        deleted: 0
      } ];

    service.getGroups(query).subscribe(actual => {
      expect(actual.length).toBe(1);

      expect(actual[ 0 ].id).toBe(mockApiResult[ 0 ].id);
      expect(actual[ 0 ].name).toBe(mockApiResult[ 0 ].name);
      expect(actual[ 0 ].schoolName).toBe(mockApiResult[ 0 ].schoolName);
      expect(actual[ 0 ].schoolYear).toBe(mockApiResult[ 0 ].schoolYear);
      expect(actual[ 0 ].isDeleted).toBe(mockApiResult[ 0 ].deleted);
    });

    groupObserver.next(mockApiResult);

    let actualParams = optionsSpy.search.paramsMap;

    expect(actualParams.get("schoolId")).toContain("1");
    expect(actualParams.get("schoolYear")).toContain("2017");
  });

  it('should handle no results found', () => {
    let school = new School();
    school.id = 1;

    let query = new GroupQuery([ "MATH", "ELA" ]);
    query.subject = "ALL";
    query.school = school;
    query.schoolYear = 2017;

    let mockApiResult = [];

    service.getGroups(query).subscribe(actual => {
      expect(actual.length).toBe(0);
    });

    groupObserver.next(mockApiResult);
  })
});

class MockDataService extends DataService {
  get(route, options): Observable<any> {
    optionsSpy = options;

    if (route === "/admin-service/groups/filters")
      return new Observable(o => filterObserver = o);


    if (route === "/admin-service/groups")
      return new Observable(o => groupObserver = o);

    throw Error("Unexpected route called");
  }
}
