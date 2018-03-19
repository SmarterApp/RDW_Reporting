import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemViewerComponent } from "./item-viewer.component";
import { CommonModule } from "../../../shared/common.module";
import { ItemScoringService } from "../item-exemplar/item-scoring.service";
import { ItemScoringGuide } from "../item-exemplar/model/item-scoring-guide.model";
import { ItemScoringGuideMapper } from "../item-exemplar/item-scoring-guide.mapper";
import { Component } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { of } from 'rxjs/observable/of';
import { ApplicationSettingsService } from '../../../app-settings.service';

describe('ItemViewerComponent', () => {
  let component: ItemViewerComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  let mockApplicationSettingsService = {
    getSettings: () => of({ irisVendorId: 'vendorId' })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ ItemViewerComponent, TestComponentWrapper ],
      providers: [
        ItemScoringGuideMapper,
        { provide: ApplicationSettingsService, useValue: mockApplicationSettingsService },
        { provide: ItemScoringService, useClass: MockItemScoringService }
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

class MockItemScoringService extends ItemScoringService {
  getGuide(item: string) {
    return of(new ItemScoringGuide());
  }
}

@Component({
  selector: 'test-component-wrapper',
  template: '<item-viewer [item]="item"></item-viewer>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
}

