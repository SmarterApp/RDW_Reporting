import { AssessmentService } from "./assessment.service";
import { MockDataService } from "../../test/mock.data.service";
import { Observable } from "rxjs/Observable";
import { Assessment } from "./model/assessment.model";
import { AssessmentQuery } from "./model/assessment-query.model";

describe("Assessment Service", () => {
  let dataService: MockDataService;
  let service: AssessmentService;

  beforeEach(() => {
    dataService = new MockDataService();
    service = new AssessmentService(dataService as any);
  });

  it("should find assessments", (done) => {
    dataService.get.and.returnValue(Observable.of([apiAssessment(1), apiAssessment(2)]));

    let query: AssessmentQuery = new AssessmentQuery();
    query.limit = 123;
    query.label = "label";
    query.name = "name";

    service.find(query)
      .toPromise()
      .then((assessments: Assessment[]) => {
        let dataArgs: any[] = dataService.get.calls.first().args;
        expect(dataArgs[0]).toEqual("/assessments");
        expect(dataArgs[1]).toEqual({params: query});

        expect(assessments.length).toBe(2);
        expect(assessments[0].id).toBe(1);
        expect(assessments[0].name).toBe("name 1");
        expect(assessments[0].grade).toBe("grade 1");
        expect(assessments[0].type).toBe("type 1");
        expect(assessments[0].subject).toBe("subject 1");
        expect(assessments[0].claimCodes.length).toBe(1);
        expect(assessments[0].claimCodes[0]).toBe("claim 1");
        expect(assessments[1].id).toBe(2);

        done();
      });
  });

  let apiAssessment = function(id: number) {
    return {
      id: id,
      label: `label ${id}`,
      name: `name ${id}`,
      gradeCode: `grade ${id}`,
      type: `type ${id}`,
      subject: `subject ${id}`,
      claimCodes: [`claim ${id}`]
    }
  }
});
