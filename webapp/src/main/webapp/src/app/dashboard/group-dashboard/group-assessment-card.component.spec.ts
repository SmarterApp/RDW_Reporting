import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupAssessmentCardComponent } from './group-assessment-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '../../shared/common.module';
import { DetailsByPerformanceLevel, MeasuredAssessment } from '../measured-assessment';
import { Assessment } from '../../assessments/model/assessment.model';
import { Group } from '../../groups/group';

describe('GroupAssessmentCardComponent', () => {

  let component: GroupAssessmentCardComponent;
  let fixture: ComponentFixture<GroupAssessmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        GroupAssessmentCardComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  function createComponent() {
    fixture = TestBed.createComponent(GroupAssessmentCardComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    createComponent();
    const studentCountByPerformanceLevel: DetailsByPerformanceLevel[] = [ <DetailsByPerformanceLevel> {
      percent: 20,
      studentCount: 2
    },
      <DetailsByPerformanceLevel> {
        percent: 30,
        studentCount: 3
      },
      <DetailsByPerformanceLevel> {
        percent: 50,
        studentCount: 5
      } ];
    const measuredAssessment = getMeasuredAssessment(studentCountByPerformanceLevel);
    component.assessment = measuredAssessment;
    component.group = <Group>{
      id: 1,
      name: 'name',
      schoolId: 123,
      totalStudents: 10
    };
    fixture.detectChanges();
    expect(component.dataWidths).toBeTruthy();
    expect(component.dataWidths).toEqual([ 20, 30, 50 ]);
  });

  it('should have percents of 33.33 have a data width sum to 100', () => {
    createComponent();
    const studentCountByPerformanceLevel: DetailsByPerformanceLevel[] = [ <DetailsByPerformanceLevel> {
      percent: (1 / 3) * 100,
      studentCount: 1
    },
      <DetailsByPerformanceLevel> {
        percent: (1 / 3) * 100,
        studentCount: 1
      },
      <DetailsByPerformanceLevel> {
        percent: (1 / 3) * 100,
        studentCount: 1
      } ];
    const measuredAssessment = getMeasuredAssessment(studentCountByPerformanceLevel);
    component.assessment = measuredAssessment;
    component.group = <Group>{
      id: 1,
      name: 'name',
      schoolId: 123,
      totalStudents: 3
    };
    fixture.detectChanges();
    expect(component.percents).toEqual(([ 33, 33, 33 ]));
    expect(component.dataWidths).toEqual([ 33, 33, 34 ]);
  });

  it('should have rounded percents sum of 101 and a data width sum to 100', () => {
    createComponent();
    const studentCountByPerformanceLevel = [ <DetailsByPerformanceLevel> {
      percent: (2 / 7) * 100,
      studentCount: 2
    },
      <DetailsByPerformanceLevel> {
        percent: (3 / 7) * 100,
        studentCount: 3
      },
      <DetailsByPerformanceLevel> {
        percent: (2 / 7) * 100,
        studentCount: 2
      } ];
    const measuredAssessment = getMeasuredAssessment(studentCountByPerformanceLevel);
    component.assessment = measuredAssessment;
    component.group = <Group>{
      id: 1,
      name: 'name',
      schoolId: 123,
      totalStudents: 7
    };
    fixture.detectChanges();
    expect(component.percents).toEqual(([ 29, 43, 29 ]));
    expect(component.dataWidths).toEqual([ 29, 43, 28 ]);
  });


});

function getAssessment(): Assessment {
  const assessment = new Assessment();
  assessment.grade = '03';
  assessment.type = 'iab';
  return assessment;
}

function getMeasuredAssessment(studentCountByPerformanceLevel: DetailsByPerformanceLevel[]): MeasuredAssessment {
  return <MeasuredAssessment>{
    assessment: getAssessment(),
    studentCountByPerformanceLevel: studentCountByPerformanceLevel,
    studentsTested: 10,
    date: new Date(),
    averageStandardError: 0,
    averageScaleScore: 0
  };
}

class MockColorService {

  getColor(index: number): string {
    return 'test-color';
  }
}
