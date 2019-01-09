import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemExemplarComponent } from "./item-exemplar.component";
import { ItemScoringService } from "./item-scoring.service";
import { ItemScoringGuideMapper } from "./item-scoring-guide.mapper";
import { CommonModule } from "../../../shared/common.module";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { MockDataService } from "../../../../test/mock.data.service";
import { CachingDataService } from "../../../shared/data/caching-data.service";
import { DataService } from "../../../shared/data/data.service";
import { AssessmentItem } from "../../model/assessment-item.model";
import { Component } from "@angular/core";
import { of } from 'rxjs';

describe('ItemExemplarComponent', () => {
  let component: ItemExemplarComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;
  let mockItemScoringGuide = {
    itemScoringGuide: new ItemScoringGuide()
  };
  let mockItemScoringService = {
    getGuide(item: string) {
      return of(mockItemScoringGuide.itemScoringGuide)
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemExemplarComponent, TestComponentWrapper ],
      imports: [ CommonModule ],
      providers: [
        ItemScoringService,
        ItemScoringGuideMapper,
        { provide: ItemScoringService, useValue: mockItemScoringService },
        { provide: CachingDataService, useClass: MockDataService },
        { provide: DataService, useClass: MockDataService } ]
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

  it('should display not found when item scoring guide is empty', () => {
    mockItemScoringGuide.itemScoringGuide.answerKeyValue = undefined;
    component.ngOnInit();
    expect(component.notFound).toBeTruthy();
    expect(component.errorLoading).toBeFalsy();
    expect(component.model.answerKeyValue).toBeUndefined();
    expect(component.model.exemplars).toEqual([]);
    expect(component.model.rubrics).toEqual([]);
  });

  it('should display answer key when item scoring guide has answer key', () => {
    mockItemScoringGuide.itemScoringGuide.answerKeyValue = "Answer";
    component.ngOnInit();
    expect(component.notFound).toBeFalsy();
    expect(component.errorLoading).toBeFalsy();
    expect(component.model.answerKeyValue).toEqual(mockItemScoringGuide.itemScoringGuide.answerKeyValue);
    expect(component.model.exemplars).toEqual([]);
    expect(component.model.rubrics).toEqual([]);
  });

});

@Component({
  selector: 'test-component-wrapper',
  template: '<item-exemplar [item]="item"></item-exemplar>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
}
