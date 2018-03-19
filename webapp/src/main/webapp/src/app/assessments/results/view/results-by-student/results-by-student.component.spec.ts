import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsByStudentComponent } from './results-by-student.component';
import { CommonModule } from "../../../../shared/common.module";
import { MenuActionBuilder } from "../../../menu/menu-action.builder";
import { TestModule } from "../../../../../test/test.module";
import { TranslateModule } from "@ngx-translate/core";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Assessment } from "../../../model/assessment.model";
import { InstructionalResourcesService } from "../../instructional-resources.service";
import { CachingDataService } from "../../../../shared/data/caching-data.service";

describe('ResultsByStudentComponent', () => {
  let component: ResultsByStudentComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
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
        MenuActionBuilder,
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
