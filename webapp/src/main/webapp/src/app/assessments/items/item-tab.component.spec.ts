import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemTabComponent } from "./item-tab.component";
import { CommonModule } from "../../shared/common.module";
import { TabsetConfig } from "ngx-bootstrap";
import { MockDataService } from "../../../test/mock.data.service";
import { StudentScoreService } from "./item-scores/student-score.service";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { TestModule } from "../../../test/test.module";
import { Angulartics2 } from "angulartics2";
import { CachingDataService } from "../../shared/data/caching-data.service";

describe('ItemTabComponent', () => {
  let component: ItemTabComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

    TestBed.configureTestingModule({
      declarations: [
        TestComponentWrapper,
        ItemTabComponent
      ],
      imports: [
        CommonModule,
        TestModule
      ],
      providers: [
        TabsetConfig,
        { provide: CachingDataService, useClass: MockDataService },
        StudentScoreService,
        { provide: Angulartics2, useValue: mockAngulartics2 }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<item-tab [item]="item" [exams]="exams" subject="Math"></item-tab>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
  exams = [];
}
