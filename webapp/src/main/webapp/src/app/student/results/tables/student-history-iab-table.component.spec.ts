import { StudentHistoryIABTableComponent } from "./student-history-iab-table.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "primeng/components/common/shared";
import { SchoolYearPipe } from "../../../shared/schoolYear.pipe";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { ScaleScorePipe } from "../../../shared/scale-score.pipe";

describe('StudentHistoryIABTableComponent', () => {
  let component: StudentHistoryIABTableComponent;
  let fixture: ComponentFixture<StudentHistoryIABTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        DataTableModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        StudentHistoryIABTableComponent,
        SchoolYearPipe,
        ScaleScorePipe
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
