import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemExemplarComponent } from "./item-exemplar.component";
import { ItemScoringService } from "./item-scoring.service";
import { ItemScoringGuideMapper } from "./item-scoring-guide.mapper";
import { CommonModule } from "../../../shared/common.module";
import { Observable } from "rxjs/Observable";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { MockDataService } from "../../../../test/mock.data.service";
import { CachingDataService } from "../../../shared/data/caching-data.service";
import { DataService } from "../../../shared/data/data.service";
import {AssessmentItem} from "../../model/assessment-item.model";
import {Component} from "@angular/core";

describe('ItemExemplarComponent', () => {
  let component: ItemExemplarComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemExemplarComponent, TestComponentWrapper ],
      imports: [ CommonModule ],
      providers: [
        ItemScoringService,
        ItemScoringGuideMapper,
        { provide: ItemScoringService, useClass: MockItemScoringService },
        { provide: CachingDataService, useClass: MockDataService },
        { provide: DataService, useClass: MockDataService } ]
    })
      .compileComponents();
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
    return Observable.of(new ItemScoringGuide());
  }
}

@Component({
  selector: 'test-component-wrapper',
  template: '<item-exemplar [item]="item"></item-exemplar>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
}
