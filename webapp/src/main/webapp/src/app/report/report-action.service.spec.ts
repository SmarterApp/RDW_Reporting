import { inject, TestBed } from "@angular/core/testing";
import { MockRouter } from "../../test/mock.router";
import { NotificationService } from "../shared/notification/notification.service";
import { Router } from "@angular/router";
import { ActionType, ReportAction, ReportActionService } from "./report-action.service";
import { EMPTY } from 'rxjs';
import Spy = jasmine.Spy;
import { UserReportService } from './user-report.service';
import { UserReport } from './report';

describe('ReportActionService', () => {
  let reportService: UserReportService;
  let router: MockRouter;
  let notificationService: NotificationService;

  let service: ReportActionService;

  beforeEach(() => {
    router = new MockRouter;

    reportService = jasmine.createSpyObj(
      "UserReportService",
      ["getReportContent", "openReport"]
    );
    (reportService.getReportContent as Spy).and.callFake(() => EMPTY);

    notificationService = jasmine.createSpyObj(
      "NotificationService",
      ["info"]
    );

    TestBed.configureTestingModule({
      providers: [
        ReportActionService,
        {
          provide: UserReportService,
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
    const report = createReport();
    report.status = "PENDING";
    expect(service.getActions(report).length).toBe(0);
  });

  it('should provide a download action for a completed report', () => {
    const report = createReport();
    report.status = "COMPLETED";

    const actions: ReportAction[] = service.getActions(report);
    expect(actions.length).toBe(1);
    expect(actions[0].type).toBe(ActionType.Download);

    service.performAction(actions[0]);
    expect(reportService.openReport).toHaveBeenCalledWith(report.id);
  });

  it('should provide multiple actions for a completed AggregateReportRequest', () => {
    const report = createReport();
    report.status = "COMPLETED";
    report.query.type = 'CustomAggregate';
    report.metadata = {'createdWhileDataEmbargoed' : 'false'};

    const actions: ReportAction[] = service.getActions(report);
    expect(actions.length).toBe(3);

    const viewReportAction: ReportAction = actions[0];
    service.performAction(viewReportAction);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/aggregate-reports/${report.id}`);

    const viewQueryAction: ReportAction = actions[1];
    service.performAction(viewQueryAction);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/aggregate-reports?src=${report.id}`);

    const downloadReportAction: ReportAction = actions[2];
    expect(downloadReportAction.popoverKey).toBeUndefined();
    expect(downloadReportAction.disabled).toBe(false);
    service.performAction(downloadReportAction);
    expect(reportService.openReport).toHaveBeenCalledWith(report.id);

  });

  it('should disable the download action for an embargoed AggregateReportRequest', () => {
    const report = createReport();
    report.status = "COMPLETED";
    report.query.type = 'CustomAggregate';
    report.metadata = {'createdWhileDataEmbargoed' : 'true'};

    const actions: ReportAction[] = service.getActions(report);
    expect(actions.length).toBe(3);

    const downloadReportAction: ReportAction = actions[2];
    expect(downloadReportAction.popoverKey.length).toBeGreaterThan(1);
    expect(downloadReportAction.disabled).toBe(true);
    service.performAction(downloadReportAction);
    expect(reportService.openReport).not.toHaveBeenCalled();
  });

  function createReport(): UserReport {
    return {
      id: 123,
      status: 'COMPLETED',
      created: null,
      query: {
        name: 'My Report',
        type: 'Student'
      }
    };
  }

});


