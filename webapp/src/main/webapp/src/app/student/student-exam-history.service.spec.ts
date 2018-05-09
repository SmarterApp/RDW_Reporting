import { inject, TestBed } from "@angular/core/testing";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { MockDataService } from "../../test/mock.data.service";
import { Observable } from "rxjs/Observable";
import { AssessmentExamMapper } from "../assessments/assessment-exam.mapper";
import { StudentExamHistory } from "./model/student-exam-history.model";
import { Assessment } from "../assessments/model/assessment.model";
import { Exam } from "../assessments/model/exam.model";
import { Student } from "./model/student.model";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { DataService } from "../shared/data/data.service";
import { _throw } from 'rxjs/observable/throw';
import { of } from 'rxjs/observable/of';

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

      dataService.get.and.returnValue(_throw({status: 404}));

      service.existsBySsid("ssid").subscribe((exists) => {
        expect(exists).toBeNull();
      });
  }));

  it('should return the student if it exists',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(of({
        id: 123
      }));

      service.existsBySsid("ssid").subscribe((exists) => {
        expect(exists.id).toEqual(123);
      });
  }));

  it('should trim the ssid value before checking if student exists',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(of({
        id: 123
      }));

      service.existsBySsid(" ssid ").subscribe((exists) => {
        expect(exists.id).toEqual(123);
      });

      expect(dataService.get.calls.first().args[0]).toMatch("/ssid$");
    }));

  it('should throw for a 404 response when retrieving history for a student',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(_throw("4xx/5xx response"));

      service.findOneById(123).subscribe(() => {
        fail("Error expected");
      }, (failure) => {
        expect(failure).toBe("4xx/5xx response");
      });
  }));

  it('should return a student\'s exam history ordered most recent exam date',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(of({
        student: {
          id: 123
        },
        exams: [ {
          exam: {
            id: 1,
            dateTime: '2017-03-15T09:24:22.561Z'
          },
          assessment: {
            id: 2
          }
        },
        {
          exam: {
            id: 2,
            dateTime: '2017-09-15T09:24:22.561Z'
          },
          assessment: {
            id: 2
          }
        }]
      }));

      service.findOneById(123).subscribe((history: StudentExamHistory) => {
        expect(history.student.id).toBe(123);
        expect(history.exams.length).toBe(2);
        expect(history.exams[0].exam.id).toBe(2);
        expect(history.exams[0].assessment.id).toBe(2);
        expect(history.exams[1].exam.id).toBe(1);
        expect(history.exams[1].assessment.id).toBe(2);
      });
    }));
});

class MockAssessmentExamMapper {
  mapAssessmentFromApi: Spy = createSpy("mapAssessmentFromApi");
  mapExamFromApi: Spy = createSpy("mapExamFromApi");
  mapStudentFromApi: Spy = createSpy("mapStudentFromApi");

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

    this.mapStudentFromApi.and.callFake((apiStudent) => {
      let student: Student = new Student();
      student.id = apiStudent.id;
      return student;
    });
  }
}
