import { MockDataService } from "../../test/mock.data.service";
import { inject, TestBed } from "@angular/core/testing";
import { DataService } from "../shared/data/data.service";
import { ReportService } from "./report.service";
import { ReportNamingService } from "./report-naming.service";
import { Student } from "../student/model/student.model";
import { ReportOptions } from "./report-options.model";
import { Group } from "../user/model/group.model";
import { Grade } from "../school-grade/grade.model";
import { School } from "../user/model/school.model";
import { Report } from "./report.model";
import { Observable } from "rxjs/Observable";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

describe('ReportService', () => {
  let dataService: MockDataService;
  let namingService: MockNamingService;
  let service: ReportService;

  beforeEach(() => {
    dataService = new MockDataService();


    TestBed.configureTestingModule({
      providers: [
        ReportService, {
          provide: DataService,
          useValue: dataService
        }, {
          provide: ReportNamingService,
          useValue: namingService
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
    reports.push(apiReportWithDetails(2, "ICA", "MATH"));
    dataService.get.and.returnValue(Observable.of(reports));

    service.getReports().subscribe((reports: Report[]) => {
      expect(reports.length).toBe(2);
      expect(reports[0].id).toBe(1);
      expect(reports[0].label).toBe("label: 1");
      expect(reports[0].reportType).toBe("Student");
      expect(reports[0].status).toBe("PENDING");
      expect(reports[0].schoolYear).toBe(1234);
      expect(reports[0].created.getTime()).toBeLessThan(new Date().getTime());
      expect(reports[0].assessmentType).toBeUndefined();
      expect(reports[0].subjectId).toBe(0);

      expect(reports[1].assessmentType).toBe(AssessmentType.ICA);
      expect(reports[1].subjectId).toBe(AssessmentSubjectType.MATH);
      done();
    });
  });

  function apiReport(id: number): any {
    return apiReportWithDetails(id, null, null);
  }

  function apiReportWithDetails(id: number, asmtType: string, subject: string) {
    let apiObj: any =  {
      id: id,
      label: `label: ${id}`,
      status: 'PENDING',
      reportType: 'Student',
      schoolYear: 1234,
      created: new Date()
    };
    if (asmtType) {
      apiObj.assessmentType = asmtType;
    }
    if (subject) {
      apiObj.subject = subject;
    }
    return apiObj;
  }
});


class MockNamingService {
  nameStudentExamReport: Spy = createSpy("nameStudentExamReport");
  nameGroupExamReport: Spy = createSpy("nameGroupExamReport");
  nameSchoolGradeExamReport: Spy = createSpy("nameSchoolGradeExamReport");

  constructor() {
    this.nameStudentExamReport.and.callFake((student: Student, options: ReportOptions) => {
      return student.ssid;
    });

    this.nameGroupExamReport.and.callFake((group: Group, options: ReportOptions) => {
      return group.name;
    });

    this.nameSchoolGradeExamReport.and.callFake((school: School, grade: Grade, options: ReportOptions) => {
      return school.name;
    });
  }
}
