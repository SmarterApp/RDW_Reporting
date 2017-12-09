import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "primeng/components/common/shared";
import { CachingDataService, DataService, PopupMenuComponent, SchoolYearPipe } from "@sbac/rdw-reporting-common-ngx";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { StudentHistoryICASummitiveTableComponent } from "./student-history-ica-summitive-table.component";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Exam } from "../../../assessments/model/exam.model";
import { Assessment } from "../../../assessments/model/assessment.model";
import { ScaleScoreComponent } from "../../../assessments/results/scale-score.component";
import { InformationButtonComponent } from "../../../shared/button/information-button.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MockRouter } from "../../../../test/mock.router";
import { GradeDisplayPipe } from "../../../shared/grade-display.pipe";
import { PopoverModule } from "ngx-bootstrap";
import { InstructionalResourcesService } from "../../../assessments/results/instructional-resources.service";
import { MockDataService } from "../../../../test/mock.data.service";
import { InstructionalResourcesMapper } from "../../../assessments/results/instructional-resources.mapper";
import { InstructionalResourcePopoverComponent } from "../../../assessments/popover/instructional-resource-popover.component";
import { SafeUrlPipe } from "../../../shared/safe-url.pipe";

describe('StudentHistoryICASummitiveTableComponent', () => {
  let component: StudentHistoryICASummitiveTableComponent;
  let fixture: ComponentFixture<StudentHistoryICASummitiveTableComponent>;
  let router: MockRouter;
  let activatedRoute: ActivatedRoute;
  let dataService: MockDataService;

  beforeEach(async(() => {
    dataService = new MockDataService();
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        DataTableModule,
        PopoverModule.forRoot(),
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        GradeDisplayPipe,
        InformationButtonComponent,
        InstructionalResourcePopoverComponent,
        StudentHistoryICASummitiveTableComponent,
        SchoolYearPipe,
        SafeUrlPipe,
        ScaleScoreComponent,
        PopupMenuComponent
      ],
      providers: [ {
        provide: Router,
        useValue: router
      }, {
        provide: ActivatedRoute,
        useValue: activatedRoute
      }, {
        provide: DataService,
        useValue: dataService
      },
        InstructionalResourcesService,
        InstructionalResourcesMapper,
        CachingDataService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHistoryICASummitiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should parse claimCode labels from exams', () => {
    expect(component.getClaims().length).toBe(0);

    let wrapper: StudentHistoryExamWrapper = new StudentHistoryExamWrapper();
    wrapper.exam = new Exam();
    wrapper.assessment = new Assessment;
    wrapper.assessment.claimCodes = [ "claimCode 1", "claimCode 2" ];

    component.exams.push(wrapper);

    expect(component.getClaims().length).toBe(2);
    expect(component.getClaims()).toContain("claimCode 1");
    expect(component.getClaims()).toContain("claimCode 2");
  });

});
