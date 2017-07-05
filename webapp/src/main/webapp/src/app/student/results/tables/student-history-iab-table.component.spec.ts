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

describe('StudentHistoryIABTableComponent', () => {
  let component: StudentHistoryIABTableComponent;
  let fixture: ComponentFixture<StudentHistoryIABTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        DataTableModule,
        PopoverModule.forRoot(),
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        InformationLabelComponent,
        StudentHistoryIABTableComponent,
        SchoolYearPipe,
        ScaleScoreComponent
      ],
      providers: []
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
