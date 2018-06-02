import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '../../../../shared/common.module';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { TestModule } from '../../../../../test/test.module';
import { TranslateModule } from '@ngx-translate/core';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Assessment } from '../../../model/assessment.model';
import { TargetReportComponent } from './target-report.component';
import { GroupAssessmentService } from '../../../../groups/results/group-assessment.service';
import { AssessmentExamMapper } from '../../../assessment-exam.mapper';
import { ExamFilterService } from '../../../filters/exam-filters/exam-filter.service';
import { ExamStatisticsCalculator } from '../../exam-statistics-calculator';
import { ExamFilterOptionsService } from '../../../filters/exam-filters/exam-filter-options.service';
import { ExamFilterOptionsMapper } from '../../../filters/exam-filters/exam-filter-options.mapper';
import { of } from 'rxjs/observable/of';
import { DataTableService } from '../../../../shared/datatable/datatable-service';

describe('TargetReportComponent', () => {
  let component: TargetReportComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    let mockGroupAssessmentService = {
      getTargetScoreExams: (id: number) => of([])
    };

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        TestModule
      ],
      declarations: [
        TargetReportComponent,
        TestComponentWrapper
      ],
      providers: [
        MenuActionBuilder,
        { provide: GroupAssessmentService, useValue: mockGroupAssessmentService },
        ExamFilterService,
        ExamFilterOptionsService,
        ExamFilterOptionsMapper,
        DataTableService,
        AssessmentExamMapper,
        ExamStatisticsCalculator
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<target-report [assessment]="assessment"></target-report>'
})
class TestComponentWrapper {
  assessment = new Assessment();
}
