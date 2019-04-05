import { MockDataService } from '../../../test/mock.data.service';
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { TestBed, inject } from '@angular/core/testing';
import { StudentResponsesService } from './student-responses.service';
import { AssessmentExamMapper } from '../../assessments/assessment-exam.mapper';
import { AssessmentItem } from '../../assessments/model/assessment-item.model';
import { Observable, of } from 'rxjs';
import { DataService } from '../../shared/data/data.service';
import { ReportingServiceRoute } from '../../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

describe('StudentResponsesService', () => {
  let dataService: MockDataService;
  let mapper: MockAssessmentExamMapper;

  beforeEach(() => {
    dataService = new MockDataService();
    mapper = new MockAssessmentExamMapper();

    TestBed.configureTestingModule({
      providers: [
        StudentResponsesService,
        { provide: DataService, useValue: dataService },
        { provide: AssessmentExamMapper, useValue: mapper }
      ]
    });
  });

  it('should find, map, and return assessment items', inject(
    [StudentResponsesService],
    (service: StudentResponsesService) => {
      dataService.get.and.callFake(url => {
        expect(url).toBe(`${ServiceRoute}/students/123/exams/456/examitems`);
        return of({ id: 123 });
      });

      service.findItemsByStudentAndExam(123, 456).subscribe(response => {
        expect(response.length).toBe(1);
        expect(response[0].id).toBe(123);
      });
    }
  ));
});

class MockAssessmentExamMapper {
  mapAssessmentItemsFromApi: Spy = createSpy('mapAssessmentItemsFromApi');

  constructor() {
    this.mapAssessmentItemsFromApi.and.callFake((apiModel: any) => {
      let item = new AssessmentItem();
      item.id = apiModel.id;
      return [item];
    });
  }
}
