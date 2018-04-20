import { TestModule } from '../../test/test.module';
import { inject, TestBed } from '@angular/core/testing';
import { MockDataService } from '../../test/mock.data.service';
import { GroupDashboardService } from './group-dashboard.service';
import { DataService } from '../shared/data/data.service';
import { MeasuredAssessmentMapper } from './measured-assessment.mapper';

describe('GroupDashboardService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      providers: [
        GroupDashboardService,
        { provide: DataService, useClass: MockDataService },
        { provide: MeasuredAssessmentMapper, useClass: MockMeasuredAssessmentMapper },
      ]
    });
  });

  it('should create',
    inject([ GroupDashboardService ], (builder: GroupDashboardService) => {
      expect(builder).toBeTruthy();
    }));
});

class MockMeasuredAssessmentMapper {

}
