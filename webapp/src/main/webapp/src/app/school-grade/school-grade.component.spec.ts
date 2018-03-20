import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SchoolGradeComponent } from "./school-grade.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "../shared/common.module";
import { SchoolService } from "./school.service";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { SharedModule } from "primeng/components/common/shared";
import { BrowserModule } from "@angular/platform-browser";
import { AssessmentsModule } from "../assessments/assessments.module";
import { RouterModule } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { TypeaheadModule } from "ngx-bootstrap";
import { UserModule } from "../user/user.module";
import { MockDataService } from "../../test/mock.data.service";
import { DataService } from "../shared/data/data.service";
import { CachingDataService } from "../shared/data/caching-data.service";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { OrganizationService } from "../shared/organization/organization.service";
import { DefaultSchool, SchoolsWrapper } from "../shared/organization/organization";

describe('SchoolGradeComponent', () => {
  let component: SchoolGradeComponent;
  let fixture: ComponentFixture<SchoolGradeComponent>;
  let mockOrganizationService = {
    getSchoolsWithDistricts: () => {
      let schools = new SchoolsWrapper();
      schools.schools.push(new DefaultSchool());
      return of(schools);
    }
  };

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
        { provide: OrganizationService, useValue: mockOrganizationService },
        { provide: APP_BASE_HREF, useValue: '/' },
        SchoolService,
        { provide: DataService, useClass: MockDataService },
        { provide: CachingDataService, useClass: MockDataService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
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
