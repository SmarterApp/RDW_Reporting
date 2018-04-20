import { TestModule } from '../../test/test.module';
import { inject, TestBed } from '@angular/core/testing';
import { MockDataService } from '../../test/mock.data.service';
import { GroupDashboardService } from './group-dashboard.service';
import { AssessmentExamMapper } from '../assessments/assessment-exam.mapper';
import { DataService } from '../shared/data/data.service';

describe('GroupDashboardService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      providers: [
        GroupDashboardService,
        { provide: DataService, useClass: MockDataService },
        { provide: AssessmentExamMapper, useClass: MockAssessmentExamMapper },
      ]
    });
  });

  it('should create',
    inject([ GroupDashboardService ], (builder: GroupDashboardService) => {
      expect(builder).toBeTruthy();
    }));
});

class MockAssessmentExamMapper {

}
