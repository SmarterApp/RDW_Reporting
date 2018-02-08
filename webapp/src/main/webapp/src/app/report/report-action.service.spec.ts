import { ReportService } from "./report.service";
import { inject, TestBed } from "@angular/core/testing";
import { MockRouter } from "../../test/mock.router";
import { NotificationService } from "../shared/notification/notification.service";
import { Router } from "@angular/router";
import { ActionType, AggregateReportType, ReportAction, ReportActionService } from "./report-action.service";
import { Report } from "./report.model";
import { Observable } from "rxjs/Observable";
import Spy = jasmine.Spy;

describe('ReportActionService', () => {
  let reportService: ReportService;
  let router: MockRouter;
  let notificationService: NotificationService;

  let service: ReportActionService;

  beforeEach(() => {
    router = new MockRouter;

    reportService = jasmine.createSpyObj(
      "ReportService",
      ["getExamReport"]
    );
    (reportService.getExamReport as Spy).and.callFake(() => Observable.empty());

    notificationService = jasmine.createSpyObj(
      "NotificationService",
      ["info"]
    );

    TestBed.configureTestingModule({
      providers: [
        ReportActionService,
        {
          provide: ReportService,
          useValue: reportService
        }, {
          provide: Router,
          useValue: router
        }, {
          provide: NotificationService,
          useValue: notificationService
        }
      ]
    });
  });

  beforeEach(inject([ ReportActionService ], (injectedSvc: ReportActionService) => {
    service = injectedSvc;
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should provide no actions for an incomplete report', () => {
    const report: Report = createReport();
    report.status = "PENDING";
    expect(service.getActions(report).length).toBe(0);
  });

  it('should provide a download action for a completed report', () => {
    const report: Report = createReport();
    report.status = "COMPLETED";

    const actions: ReportAction[] = service.getActions(report);
    expect(actions.length).toBe(1);
    expect(actions[0].type).toBe(ActionType.Download);

    service.performAction(actions[0]);
    expect(reportService.getExamReport).toHaveBeenCalledWith(report.id);
  });

  it('should provide multiple actions for a completed AggregateReportRequest', () => {
    const report: Report = createReport();
    report.status = "COMPLETED";
    report.reportType = AggregateReportType;

    const actions: ReportAction[] = service.getActions(report);
    expect(actions.length).toBe(3);

    const viewReportAction: ReportAction = actions[0];
    service.performAction(viewReportAction);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/aggregate-reports/${report.id}`);

    const viewQueryAction: ReportAction = actions[1];
    service.performAction(viewQueryAction);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/aggregate-reports?src=${report.id}`);

    const downloadReportAction: ReportAction = actions[2];
    service.performAction(downloadReportAction);
    expect(reportService.getExamReport).toHaveBeenCalledWith(report.id);
  });

  function createReport(): Report {
    const report: Report = new Report();
    report.id = 123;
    report.status = "COMPLETED";
    report.label = "My Report";
    report.reportType = "Student";
    return report;
  }

});


