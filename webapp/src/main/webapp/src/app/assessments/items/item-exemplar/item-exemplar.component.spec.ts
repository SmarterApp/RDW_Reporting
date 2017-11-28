import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemExemplarComponent } from "./item-exemplar.component";
import { ItemScoringService } from "./item-scoring.service";
import { ItemScoringGuideMapper } from "./item-scoring-guide.mapper";
import { CommonModule } from "../../../shared/common.module";
import { Observable } from "rxjs/Observable";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { CachingDataService } from "@sbac/rdw-reporting-common-ngx";
import { MockDataService } from "../../../../test/mock.data.service";
import { DataService } from "@sbac/rdw-reporting-common-ngx";

describe('ItemExemplarComponent', () => {
  let component: ItemExemplarComponent;
  let fixture: ComponentFixture<ItemExemplarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemExemplarComponent ],
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
    fixture = TestBed.createComponent(ItemExemplarComponent);
    component = fixture.componentInstance;
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
