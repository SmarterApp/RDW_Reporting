import { MockDataService } from "../../test/mock.data.service";
import { inject, TestBed } from "@angular/core/testing";
import { ReportService } from "./report.service";
import { Student } from "../student/model/student.model";
import { Report } from "./report.model";
import { DATA_CONTEXT_URL, DataService } from "../shared/data/data.service";
import { of } from 'rxjs/observable/of';

describe('ReportService', () => {
  let dataService: MockDataService;
  let service: ReportService;

  beforeEach(() => {
    dataService = new MockDataService();

    TestBed.configureTestingModule({
      providers: [
        ReportService, {
          provide: DataService,
          useValue: dataService
        }, {
          provide: DATA_CONTEXT_URL,
          useValue: '/api'
        }
      ]
    });
  });

  beforeEach(inject([ReportService], (injectedSvc: ReportService) => {
    service = injectedSvc;
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve reports for a user', (done) => {
    let reports: Report[] = [];
    reports.push(apiReport(1));
    reports.push(apiReportWithDetails(2, "ica", ["Math"]));
    dataService.get.and.returnValue(of(reports));
    service.getReports().subscribe((reports: Report[]) => {
      expect(reports.length).toBe(2);
      expect(reports[0].id).toBe(1);
      expect(reports[0].label).toBe("label: 1");
      expect(reports[0].reportType).toBe("Student");
      expect(reports[0].status).toBe("PENDING");
      expect(reports[0].schoolYears).toEqual([1234]);
      expect(reports[0].created.getTime()).toBeLessThanOrEqual(new Date().getTime());
      expect(reports[0].assessmentTypeCode).toBeUndefined();
      expect(reports[0].subjectCodes.length).toBe(0);

      expect(reports[1].assessmentTypeCode).toBe("ica");
      expect(reports[1].subjectCodes).toEqual(["Math"]);
      done();
    });
  });

  function apiReport(id: number): any {
    return apiReportWithDetails(id, null, null);
  }

  function apiReportWithDetails(id: number, asmtType: string, subjects: string[]) {
    let apiObj: any =  {
      id: id,
      label: `label: ${id}`,
      status: 'PENDING',
      reportType: 'Student',
      schoolYears: [1234],
      created: new Date()
    };
    if (asmtType) {
      apiObj.assessmentTypeCode = asmtType;
    }
    if (subjects) {
      apiObj.subjectCodes = subjects;
    }
    return apiObj;
  }
});
