import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsByStudentComponent } from './results-by-student.component';
import { CommonModule } from "../../../../shared/common.module";
import { MenuActionBuilder } from "../../../menu/menu-action.builder";
import { TestModule } from "../../../../../test/test.module";
import { TranslateModule } from "@ngx-translate/core";
import { Angulartics2 } from "angulartics2";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { MockDataService } from "../../../../../test/mock.data.service";
import { Assessment } from "../../../model/assessment.model";
import { InstructionalResourcesService } from "../../instructional-resources.service";
import { CachingDataService } from "@sbac/rdw-reporting-common-ngx/data/caching-data.service";
import { DataService } from "@sbac/rdw-reporting-common-ngx/data/data.service";
import { InstructionalResourcesMapper } from "../../instructional-resources.mapper";

describe('ResultsByStudentComponent', () => {
  let component: ResultsByStudentComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  let dataService: MockDataService;
  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

  beforeEach(async(() => {
    dataService = new MockDataService();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        TestModule
      ],
      declarations: [
        ResultsByStudentComponent,
        TestComponentWrapper
      ],
      providers: [
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: DataService, useValue: dataService },
        MenuActionBuilder,
        InstructionalResourcesMapper,
        InstructionalResourcesService,
        CachingDataService
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
  template: '<results-by-student [assessment]="assessment" [exams]="[]" [minimumItemDataYear]="2017"></results-by-student>'
})
class TestComponentWrapper {
  assessment = new Assessment();
}
