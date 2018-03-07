import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdvFiltersComponent } from "./adv-filters.component";
import { APP_BASE_HREF } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Component } from "@angular/core";
import { FilterBy } from "../../model/filter-by.model";
import { CommonModule } from "../../../shared/common.module";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";
import { Angulartics2, Angulartics2Module } from "angulartics2";
import { PopoverModule } from "ngx-bootstrap";
import { User } from "../../../user/model/user.model";
import { Configuration } from "../../../user/model/configuration.model";
import { UserService } from "../../../user/user.service";
import { of } from 'rxjs/observable/of';

describe('AdvFiltersComponent', () => {
  let component: AdvFiltersComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

  let config: Configuration = new Configuration();
  config.transferAccess = false;
  let user: User = new User();
  user.configuration = config;
  let mockUserService = jasmine.createSpyObj('UserService', [ 'getCurrentUser' ]);
  mockUserService.getCurrentUser.and.callFake(() => of(user));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponentWrapper,
        AdvFiltersComponent
      ],
      imports: [
        HttpModule,
        FormsModule,
        CommonModule,
        Angulartics2Module,
        PopoverModule.forRoot()
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: UserService, useValue: mockUserService }
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

  it('should detect transfer access enabled', (done) => {
    component.ngOnInit();
    expect(component.showTransferAccess).toBe(false);

    config.transferAccess = true;
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(component.showTransferAccess).toBe(true);
        done();
      });
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<adv-filters [filterBy]="filterBy" [filterOptions]="filterOptions"></adv-filters>'
})
class TestComponentWrapper {
  filterBy: FilterBy = new FilterBy();
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
}

