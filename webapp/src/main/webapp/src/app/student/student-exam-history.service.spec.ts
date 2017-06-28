import { TestBed, inject } from "@angular/core/testing";
import { StudentExamHistoryService } from "./student-exam-history.service";
import { DataService } from "../shared/data/data.service";
import { MockDataService } from "../../test/mock.data.service";
import { Observable } from "rxjs";

describe('TestServiceService', () => {
  let dataService: MockDataService;

  beforeEach(() => {
    dataService = new MockDataService();

    TestBed.configureTestingModule({
      providers: [
        StudentExamHistoryService, {
          provide: DataService,
          useValue: dataService
        }
      ]
    });
  });

  it('should return false for a 404 response',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

    dataService.get.and.returnValue(Observable.throw("4xx/5xx response"));
    expect(service).toBeTruthy();

    service.existsById("ssid").subscribe((exists) => {
      expect(exists).toBe(false);
    });
  }));

  it('should return true for any non-empty response',
    inject([StudentExamHistoryService], (service: StudentExamHistoryService) => {

      dataService.get.and.returnValue(Observable.of({student: "data"}));
      expect(service).toBeTruthy();

      service.existsById("ssid").subscribe((exists) => {
        expect(exists).toBe(true);
      });
    }));
});
