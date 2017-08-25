import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemViewerComponent } from "./item-viewer.component";
import { UserService } from "../../../user/user.service";
import { CommonModule } from "../../../shared/common.module";
import { MockUserService } from "../../../../test/mock.user.service";
import { ItemScoringService } from "../item-exemplar/item-scoring.service";
import { Observable } from "rxjs/Observable";
import { ItemScoringGuide } from "../item-exemplar/model/item-scoring-guide.model";
import { ItemScoringGuideMapper } from "../item-exemplar/item-scoring-guide.mapper";

describe('ItemViewerComponent', () => {
  let component: ItemViewerComponent;
  let fixture: ComponentFixture<ItemViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ ItemViewerComponent ],
      providers: [
        ItemScoringGuideMapper,
        { provide: UserService, useClass: MockUserService },
        { provide: ItemScoringService, useClass: MockItemScoringService }
        ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewerComponent);
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

