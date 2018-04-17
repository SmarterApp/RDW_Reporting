import { AssessmentService } from './assessment.service';
import { Assessment } from './model/assessment.model';
import { AssessmentQuery } from './model/assessment-query.model';
import { MockDataService } from '../../../test/mock.data.service';
import { of } from 'rxjs/observable/of';

describe('Assessment Service', () => {
  let dataService: MockDataService;
  let service: AssessmentService;

  beforeEach(() => {
    dataService = new MockDataService();
    service = new AssessmentService(dataService as any);
  });

  it('should find assessments', (done) => {
    dataService.get.and.returnValue(of([ apiAssessment(1), apiAssessment(2) ]));

    const query: AssessmentQuery = new AssessmentQuery();
    query.limit = 123;
    query.label = 'label';
    query.name = 'name';

    service.find(query)
      .subscribe((assessments: Assessment[]) => {
        const dataArgs: any[] = dataService.get.calls.first().args;
        expect(dataArgs).toEqual([
          '/admin-service/assessments',
          { params: query }
        ]);

        expect(assessments.length).toBe(2);
        expect(assessments[ 0 ].id).toBe(1);
        expect(assessments[ 0 ].name).toBe('name 1');
        expect(assessments[ 0 ].grade).toBe('grade 1');
        expect(assessments[ 0 ].type).toBe('type 1');
        expect(assessments[ 0 ].subject).toBe('subject 1');
        expect(assessments[ 0 ].claimCodes.length).toBe(1);
        expect(assessments[ 0 ].claimCodes[ 0 ]).toBe('claim 1');
        expect(assessments[ 1 ].id).toBe(2);

        done();
      });
  });

  function apiAssessment(id: number): any {
    return {
      id: id,
      label: `label ${id}`,
      name: `name ${id}`,
      gradeCode: `grade ${id}`,
      typeCode: `type ${id}`,
      subjectCode: `subject ${id}`,
      claimCodes: [ `claim ${id}` ]
    };
  };
});
