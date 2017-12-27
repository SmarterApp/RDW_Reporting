import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "primeng/components/common/shared";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { StudentHistoryICASummitiveTableComponent } from "./student-history-ica-summitive-table.component";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Exam } from "../../../assessments/model/exam.model";
import { Assessment } from "../../../assessments/model/assessment.model";
import { InformationButtonComponent } from "../../../shared/button/information-button.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MockRouter } from "../../../../test/mock.router";
import { GradeDisplayPipe } from "../../../shared/grade-display.pipe";
import { PopoverModule } from "ngx-bootstrap";
import { InstructionalResourcesService } from "../../../assessments/results/instructional-resources.service";
import { MockDataService } from "../../../../test/mock.data.service";
import { InstructionalResourcePopoverComponent } from "../../../assessments/popover/instructional-resource-popover.component";
import { ScaleScoreComponent } from "../../../shared/scale-score/scale-score.component";
import { SchoolYearPipe } from "../../../shared/format/school-year.pipe";
import { PopupMenuComponent } from "../../../shared/menu/popup-menu.component";
import { DataService } from "../../../shared/data/data.service";
import { CachingDataService } from "../../../shared/data/caching-data.service";

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
