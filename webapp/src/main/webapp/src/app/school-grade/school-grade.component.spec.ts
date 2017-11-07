import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SchoolGradeComponent } from "./school-grade.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "../shared/common.module";
import { SchoolService } from "./school.service";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { SharedModule } from "primeng/components/common/shared";
import { BrowserModule } from "@angular/platform-browser";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { AssessmentsModule } from "../assessments/assessments.module";
import { RouterModule } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { TypeaheadModule } from "ngx-bootstrap";
import { OrganizationService } from "./organization.service";
import { UserModule } from "../user/user.module";
import { CachingDataService } from "@sbac/rdw-reporting-common-ngx";
import { MockDataService } from "../../test/mock.data.service";

describe('SchoolGradeComponent', () => {
  let component: SchoolGradeComponent;
  let fixture: ComponentFixture<SchoolGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AssessmentsModule,
        RouterModule.forRoot([]),
        DropdownModule,
        TypeaheadModule,
        SharedModule,
        UserModule
      ],
      declarations: [ SchoolGradeComponent ],
      providers: [
        OrganizationService,
        { provide: APP_BASE_HREF, useValue: '/' },
        SchoolService, {
          provide: DataService,
          useClass: MockDataService
        }, {
          provide: CachingDataService,
          useClass: MockDataService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
