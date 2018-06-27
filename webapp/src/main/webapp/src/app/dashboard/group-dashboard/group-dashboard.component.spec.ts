import { TestModule } from '../../../test/test.module';
import { inject, TestBed } from '@angular/core/testing';
import { GroupDashboardService } from './group-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../groups/group.service';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { MockActivatedRoute } from '../../shared/test/mock.activated-route';
import { GroupDashboardComponent } from './group-dashboard.component';
import { MockRouter } from '../../shared/test/mock.router';
import { UserGroupService } from '../../user-group/user-group.service';
import { SubjectService } from '../../subject/subject.service';

describe('GroupDashboardComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      providers: [
        GroupDashboardComponent,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: UserGroupService, useClass: MockUserGroupService },
        { provide: GroupService, useClass: MockGroupService },
        { provide: GroupDashboardService, useClass: MockGroupDashboardService },
        { provide: ExamFilterOptionsService, useClass: MockExamFilterOptionsService },
        { provide: SubjectService, useClass: MockSubjectService }
      ]
    });
  });

  it('should create',
    inject([ GroupDashboardComponent ], (builder: GroupDashboardComponent) => {
      expect(builder).toBeTruthy();
    }));

  it('should return undefined subject by default',
    inject([ GroupDashboardComponent ], (builder: GroupDashboardComponent) => {
      expect(builder.subject).toBeUndefined();
    }));

  it('should respect card view enabled property',
    inject([ GroupDashboardComponent ], (builder: GroupDashboardComponent) => {
      expect(builder.viewAssessmentsButtonEnabled).toBeFalsy();
    }));
});

class MockGroupService {

}

class MockGroupDashboardService {

}

class MockExamFilterOptionsService {

}

class MockUserGroupService {

}

class MockSubjectService {

}

