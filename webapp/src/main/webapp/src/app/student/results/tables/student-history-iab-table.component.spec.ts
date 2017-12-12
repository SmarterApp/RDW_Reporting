import { StudentHistoryIABTableComponent } from "./student-history-iab-table.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "primeng/components/common/shared";
import { CachingDataService, PopupMenuComponent, SchoolYearPipe } from "@sbac/rdw-reporting-common-ngx";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { ScaleScoreComponent } from "../../../assessments/results/scale-score.component";
import { InformationButtonComponent } from "../../../shared/button/information-button.component";
import { MockRouter } from "../../../../test/mock.router";
import { ActivatedRoute, Router } from "@angular/router";
import { GradeDisplayPipe } from "../../../shared/grade-display.pipe";
import { PopoverModule } from "ngx-bootstrap";
import { InstructionalResourcesService } from "../../../assessments/results/instructional-resources.service";
import { DataService } from "@sbac/rdw-reporting-common-ngx/data/data.service";
import { MockDataService } from "../../../../test/mock.data.service";
import { InstructionalResourcePopoverComponent } from "../../../assessments/popover/instructional-resource-popover.component";

describe('StudentHistoryIABTableComponent', () => {
  let component: StudentHistoryIABTableComponent;
  let fixture: ComponentFixture<StudentHistoryIABTableComponent>;
  let router: MockRouter;
  let activatedRoute: ActivatedRoute;
  let dataService: MockDataService;

  beforeEach(async(() => {
    router = new MockRouter();
    activatedRoute = new ActivatedRoute();
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
        StudentHistoryIABTableComponent,
        InstructionalResourcePopoverComponent,
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
    fixture = TestBed.createComponent(StudentHistoryIABTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
