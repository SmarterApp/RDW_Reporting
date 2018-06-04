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
import { TargetStatisticsCalculator } from '../../target-statistics-calculator';
import { SubgroupMapper } from '../../../../aggregate-report/subgroup/subgroup.mapper';
import { AggregateReportRequestMapper } from '../../../../aggregate-report/aggregate-report-request.mapper';
import { AggregateReportOrganizationService } from '../../../../aggregate-report/aggregate-report-organization.service';
import { AggregateReportService } from '../../../../aggregate-report/aggregate-report.service';
import { ReportService } from '../../../../report/report.service';
import { AssessmentService } from '../../../../aggregate-report/assessment/assessment.service';

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
        ExamStatisticsCalculator,
        TargetStatisticsCalculator,
        SubgroupMapper,
        AggregateReportRequestMapper,
        AggregateReportOrganizationService,
        AggregateReportService,
        ReportService,
        AssessmentService
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
