import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemTabComponent } from "./item-tab.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ItemViewerComponent } from "./item-viewer/item-viewer.component";
import { CommonModule } from "../../shared/common.module";
import { TabsetConfig } from "ngx-bootstrap";
import { DataService } from "../../shared/data/data.service";
import { MockDataService } from "../../../test/mock.data.service";
import { CachingDataService } from "../../shared/cachingData.service";
import { ItemExemplarComponent } from "./item-exemplar/item-exemplar.component";

describe('ItemTabComponent', () => {
  let component: ItemTabComponent;
  let fixture: ComponentFixture<ItemTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TabsModule, CommonModule ],
      declarations: [ ItemTabComponent, ItemViewerComponent, ItemExemplarComponent ],
      providers: [TabsetConfig, { provide: CachingDataService, useClass: MockDataService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
