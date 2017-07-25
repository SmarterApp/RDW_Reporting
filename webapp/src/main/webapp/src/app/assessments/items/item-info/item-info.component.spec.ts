import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemInfoComponent } from "./item-info.component";
import { CommonModule } from "../../../shared/common.module";
import { AssessmentItem } from "../../model/assessment-item.model";
import { Component } from "@angular/core";
import { MockUserService } from "../../../../test/mock.user.service";
import { UserService } from "../../../user/user.service";

describe('ItemInfoComponent', () => {
  let component: ItemInfoComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ ItemInfoComponent, TestComponentWrapper ],
      providers: [ { provide: UserService, useClass: MockUserService } ]
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

@Component({
  selector: 'test-component-wrapper',
  template: '<item-info [item]="item" ></item-info>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
  exams = [];
}
