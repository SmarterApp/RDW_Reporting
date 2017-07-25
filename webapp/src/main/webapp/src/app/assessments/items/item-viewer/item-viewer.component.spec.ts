import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemViewerComponent } from "./item-viewer.component";
import { UserService } from "../../../user/user.service";
import { CommonModule } from "../../../shared/common.module";
import { MockUserService } from "../../../../test/mock.user.service";

describe('ItemViewerComponent', () => {
  let component: ItemViewerComponent;
  let fixture: ComponentFixture<ItemViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ ItemViewerComponent ],
      providers: [ { provide: UserService, useClass: MockUserService } ]
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

