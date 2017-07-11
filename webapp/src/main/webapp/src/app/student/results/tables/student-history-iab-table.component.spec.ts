import { StudentHistoryIABTableComponent } from "./student-history-iab-table.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "primeng/components/common/shared";
import { SchoolYearPipe } from "../../../shared/schoolYear.pipe";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { PopoverModule } from "ngx-bootstrap";
import { ScaleScoreComponent } from "../../../assessments/results/scale-score.component";
import { InformationLabelComponent } from "../../../assessments/results/information-label.component";
import { PopupMenuComponent } from "../../../assessments/menu/popup-menu.component";
import { MockRouter } from "../../../../test/mock.router";
import { Router, ActivatedRoute } from "@angular/router";
import { GradeDisplayPipe } from "../../../shared/grade-display.pipe";

describe('StudentHistoryIABTableComponent', () => {
  let component: StudentHistoryIABTableComponent;
  let fixture: ComponentFixture<StudentHistoryIABTableComponent>;
  let router: MockRouter;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    router = new MockRouter();
    activatedRoute = new ActivatedRoute();

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
        InformationLabelComponent,
        StudentHistoryIABTableComponent,
        SchoolYearPipe,
        ScaleScoreComponent,
        PopupMenuComponent
      ],
      providers: [{
        provide: Router,
        useValue: router
      }, {
        provide: ActivatedRoute,
        useValue: activatedRoute
      }]
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
