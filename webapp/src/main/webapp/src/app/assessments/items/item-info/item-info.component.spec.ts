import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemInfoComponent } from "./item-info.component";
import { CommonModule } from "../../../shared/common.module";
import { AssessmentItem } from "../../model/assessment-item.model";
import { Component } from "@angular/core";
import { ItemInfoService } from "./item-info.service";
import { ApplicationSettingsService } from '../../../app-settings.service';
import { of } from 'rxjs/observable/of';

describe('ItemInfoComponent', () => {
  let component: ItemInfoComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;
  const mockApplicationSettingsService = {
    getSettings: () => of({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        ItemInfoComponent,
        TestComponentWrapper
      ],
      providers: [
        { provide: ApplicationSettingsService, useValue: mockApplicationSettingsService },
        ItemInfoService
      ]
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
  template: '<item-info [item]="item" subject="Math"></item-info>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
  exams = [];
}
