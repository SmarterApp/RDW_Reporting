import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemTabComponent } from "./item-tab.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ItemViewerComponent } from "./item-viewer/item-viewer.component";
import { CommonModule } from "../../shared/common.module";
import { TabsetConfig } from "ngx-bootstrap";
import { MockDataService } from "../../../test/mock.data.service";
import { CachingDataService } from "../../shared/cachingData.service";
import { ItemExemplarComponent } from "./item-exemplar/item-exemplar.component";
import { ItemScoresComponent } from "./item-scores/item-scores.component";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { StudentScoreService } from "./item-scores/student-score.service";
import { Component } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { PopupMenuComponent } from "../menu/popup-menu.component";
import { TestModule } from "../../../test/test.module";
import { ItemInfoComponent } from "./item-info/item-info.component";
import { Angulartics2Module, Angulartics2 } from "angulartics2";

describe('ItemTabComponent', () => {
  let component: ItemTabComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

    TestBed.configureTestingModule({
      imports: [ TabsModule, CommonModule, DataTableModule, TestModule, Angulartics2Module ],
      declarations: [ TestComponentWrapper, ItemTabComponent, ItemViewerComponent, ItemInfoComponent, ItemExemplarComponent, ItemScoresComponent, PopupMenuComponent ],
      providers: [
        TabsetConfig,
        { provide: CachingDataService, useClass: MockDataService },
        StudentScoreService,
        { provide: Angulartics2, useValue: mockAngulartics2 }
      ]
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
  template: '<item-tab [item]="item" [exams]="exams"></item-tab>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
  exams = [];
}
