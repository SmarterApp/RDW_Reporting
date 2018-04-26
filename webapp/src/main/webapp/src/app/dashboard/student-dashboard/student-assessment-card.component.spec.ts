import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentAssessmentCardComponent } from './student-assessment-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '../../shared/common.module';
import { Assessment } from '../../assessments/model/assessment.model';
import { StudentHistoryExamWrapper } from '../../student/model/student-history-exam-wrapper.model';
import { Exam } from '../../assessments/model/exam.model';

describe('StudentAssessmentCardComponent', () => {

  let component: StudentAssessmentCardComponent;
  let fixture: ComponentFixture<StudentAssessmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        StudentAssessmentCardComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  function createComponent() {
    fixture = TestBed.createComponent(StudentAssessmentCardComponent);
    component = fixture.componentInstance;
  }

  it('should be able to find a match', () => {
    createComponent();
    const latestExam = getStudentHistoryExamWrapper('iab', 'find this', 2, new Date(10));
    const exams = [ getStudentHistoryExamWrapper('iab', 'something else', 3, new Date(15)), getStudentHistoryExamWrapper('iab', 'find this', 1, new Date(10)) ];
    component.latestExam = latestExam;
    component.exams = exams;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.latestExam).toEqual(latestExam);
    expect(component.resultCount).toEqual(1);
  });

  it('should be able to find 2 matches', () => {
    createComponent();
    const latestExam = getStudentHistoryExamWrapper('iab', 'find this', 2, new Date(10));
    const exams = [ getStudentHistoryExamWrapper('iab', 'find this', 2, new Date(10)), getStudentHistoryExamWrapper('ica', 'something else', 2, new Date(15)), getStudentHistoryExamWrapper('iab', 'find this', 3, new Date(2)) ];
    component.latestExam = latestExam;
    component.exams = exams;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.latestExam).toEqual(latestExam);
    expect(component.resultCount).toEqual(2);
  });


});

function getAssessment(type: string, label: string): Assessment {
  const assessment = new Assessment();
  assessment.grade = '03';
  assessment.type = type;
  assessment.label = label;
  return assessment;
}

function getExam(level: number, date: Date): Exam {
  const exam = new Exam();
  exam.date = date;
  exam.level = level;
  return exam;
}

function getStudentHistoryExamWrapper(type: string, label: string, level: number, date: Date): StudentHistoryExamWrapper {
  return {
    assessment: getAssessment(type, label),
    exam: getExam(level, date),
    school: null,
    selected: false
  };
}

class MockColorService {

  getColor(index: number): string {
    return 'test-color';
  }
}
