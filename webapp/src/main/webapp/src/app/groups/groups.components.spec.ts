import { async, TestBed } from "@angular/core/testing";
import { GroupsComponent } from "./groups.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { HttpModule } from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";

let mockGroups = [
  { name: "advanced mathematics" },
  { name: "advanced english" },
  { name: "intermediate math" },
  { name: "geometry group" },
  { name: "basic MATH" }
];

describe('GroupComponents', () => {
  var fixture, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, TranslateModule.forRoot(), DataTableModule, SharedModule, RouterModule.forRoot([]), HttpModule ],
      declarations: [ GroupsComponent, TestComponentWrapper ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' } ]
    });

    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;
    fixture.detectChanges();
  });

  describe('Search Groups', () => {

    it('should search groups that starts with', async(() => {
      setSearchValue("adv");
      expect(component.filteredGroups.length).toBe(2);
    }));

    it('should search and match any part of the string', async(() => {
      setSearchValue("eng");
      expect(component.filteredGroups.length).toBe(1);
    }));

    it('should search and not be case sensitive', async(() => {
      setSearchValue("math");
      expect(component.filteredGroups.length).toBe(3);
    }));

    function setSearchValue(value: string) {
      let input = fixture.debugElement.query(By.css('#search')).nativeElement;

      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  })
});

@Component({
  selector: 'test-component-wrapper',
  template: '<groups [groups]="groups"></groups>'
})
class TestComponentWrapper {
  groups = mockGroups;
}
