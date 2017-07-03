import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "primeng/components/common/shared";
import { SchoolYearPipe } from "../../../shared/schoolYear.pipe";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { ScaleScorePipe } from "../../../shared/scale-score.pipe";
import { StudentHistoryICASummitiveTableComponent } from "./student-history-ica-summitive-table.component";
import { StudentHistoryExamWrapper } from "../../model/student-history-exam-wrapper.model";
import { Exam } from "../../../assessments/model/exam.model";
import { Assessment } from "../../../assessments/model/assessment.model";
import { School } from "../../../user/model/school.model";

describe('StudentHistoryICASummitiveTableComponent', () => {
  let component: StudentHistoryICASummitiveTableComponent;
  let fixture: ComponentFixture<StudentHistoryICASummitiveTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        DataTableModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        StudentHistoryICASummitiveTableComponent,
        SchoolYearPipe,
        ScaleScorePipe
      ],
      providers: []
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

  it('should parse claim labels from exams', () => {
    expect(component.getClaims().length).toBe(0);

    let exam: Exam = new Exam();
    let assessment: Assessment = new Assessment();
    assessment.claimCodes = ["claim 1", "claim 2"];
    let school: School = new School();
    let wrapper: StudentHistoryExamWrapper = new StudentHistoryExamWrapper(assessment, exam, school);

    component.exams.push(wrapper);

    expect(component.getClaims().length).toBe(2);
    expect(component.getClaims()).toContain("claim 1");
    expect(component.getClaims()).toContain("claim 2");
  });

});
