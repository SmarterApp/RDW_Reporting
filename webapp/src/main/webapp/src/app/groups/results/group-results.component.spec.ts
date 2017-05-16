import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupResultsComponent } from './group-results.component';
import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { DataService } from "../../shared/data.service";
import { HttpModule } from "@angular/http";

class MockDataService extends DataService {
  public getGroups() {
    let result = [
      { name: "advanced mathematics" },
      { name: "advanced english" },
      { name: "intermediate math" },
      { name: "geometry group" },
      { name: "basic MATH" }
    ];

    return Observable.of(result);
  }
}

describe('GroupResultsComponent', () => {
  let component: GroupResultsComponent;
  let fixture: ComponentFixture<GroupResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupResultsComponent ],
      imports: [ TranslateModule.forRoot(), HttpModule ],
      providers: [ { provide: DataService, useClass: MockDataService } ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
