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

describe('ItemTabComponent', () => {
  let component: ItemTabComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TabsModule, CommonModule, DataTableModule, TestModule ],
      declarations: [ TestComponentWrapper, ItemTabComponent, ItemViewerComponent, ItemExemplarComponent, ItemScoresComponent, PopupMenuComponent ],
      providers: [TabsetConfig, { provide: CachingDataService, useClass: MockDataService }, StudentScoreService]
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
