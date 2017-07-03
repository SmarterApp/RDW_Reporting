import { TestBed, inject } from "@angular/core/testing";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { DataService } from "../shared/data/data.service";
import { MockDataService } from "../../test/mock.data.service";
import { Observable } from "rxjs";
import { AssessmentExamMapper } from "../assessments/assessment-exam.mapper";
import { StudentExamHistory } from "./model/student-exam-history.model";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { Assessment } from "../assessments/model/assessment.model";
import { Exam } from "../assessments/model/exam.model";

describe('StudentExamHistoryService', () => {
  let dataService: MockDataService;
  let mapper: MockAssessmentExamMapper;

  beforeEach(() => {
    dataService = new MockDataService();
    mapper = new MockAssessmentExamMapper();

    TestBed.configureTestingModule({
      providers: [
        StudentExamHistoryService, {
          provide: DataService,
          useValue: dataService
        }, {
          provide: AssessmentExamMapper,
          useValue: mapper
        }
      ]
    });
  });

  it('should create',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      expect(service).toBeTruthy();
  }));

  it('should return null for a 404 response when finding student by ssid',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(Observable.throw("4xx/5xx response"));

      service.existsBySsid("ssid").subscribe((exists) => {
        expect(exists).toBeNull();
      });
  }));

  it('should return the student if it exists',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(Observable.of({
        id: 123,
        firstName: "first",
        lastName: "last",
        ssid: "ssid"
      }));

      service.existsBySsid("ssid").subscribe((exists) => {
        expect(exists.id).toEqual(123);
        expect(exists.firstName).toEqual("first");
        expect(exists.lastName).toEqual("last");
        expect(exists.ssid).toEqual("ssid");
      });
  }));

  it('should throw for a 404 response when retrieving history for a student',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(Observable.throw("4xx/5xx response"));

      service.findOneById(123).subscribe(() => {
        fail("Error expected");
      }, (failure) => {
        expect(failure).toBe("4xx/5xx response");
      });
  }));

  it('should return a student\'s exam history',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(Observable.of({
        student: {
          id: 123
        },
        exams: [ {
          exam: {
            id: 1
          },
          assessment: {
            id: 2
          },
          school: {
            id: 3
          }
        }]
      }));

      service.findOneById(123).subscribe((history: StudentExamHistory) => {
        expect(history.student.id).toBe(123);
        expect(history.exams.length).toBe(1);
        expect(history.exams[0].exam.id).toBe(1);
        expect(history.exams[0].assessment.id).toBe(2);
        expect(history.exams[0].school.id).toBe(3);
      });
    }));
});

class MockAssessmentExamMapper {
  mapAssessmentFromApi: Spy = createSpy("mapAssessmentFromApi");
  mapExamFromApi: Spy = createSpy("mapExamFromApi");

  constructor() {
    this.mapAssessmentFromApi.and.callFake((apiAssessment) => {
      let assessment: Assessment = new Assessment();
      assessment.id = apiAssessment.id;
      return assessment;
    });

    this.mapExamFromApi.and.callFake((apiExam) => {
      let exam: Exam = new Exam();
      exam.id = apiExam.id;
      return exam;
    });
  }
}
