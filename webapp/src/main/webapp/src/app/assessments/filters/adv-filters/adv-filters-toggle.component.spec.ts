import { AdvFiltersToggleComponent } from "./adv-filters-toggle.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { HttpModule } from "@angular/http";
import { SharedModule } from "primeng/components/common/shared";
import { ExamFilterService } from "../exam-filters/exam-filter.service";
import Spy = jasmine.Spy;

describe('AdvFiltersToggleComponent', () => {
  let component: AdvFiltersToggleComponent;
  let fixture: ComponentFixture<AdvFiltersToggleComponent>;
  let filterService: MockExamFilterService;

  beforeEach(async(() => {
    filterService = new MockExamFilterService();
    filterService.getFilterDefinitions.and.returnValue([]);

    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), HttpModule, SharedModule ],
      declarations: [ AdvFiltersToggleComponent ],
      providers: [ {
        provide: ExamFilterService,
        useValue: filterService
      } ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvFiltersToggleComponent);
    component = fixture.debugElement.children[ 0 ].componentInstance;

    fixture.detectChanges();

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve and parse filters', () => {
    filterService.getFilterDefinitions.and.returnValue([
      { name: 'filter A' },
      { name: 'filter B' }
    ]);

    component.ngOnInit();

    expect(Object.keys(component.filters).length).toBe(2);
    expect(component.filters[ 'filter A' ].name).toBe('filter A');
    expect(component.filters[ 'filter B' ].name).toBe('filter B');
  });

});

class MockExamFilterService {
  public getFilterDefinitions: Spy = jasmine.createSpy("getFilterDefinitions");
}
