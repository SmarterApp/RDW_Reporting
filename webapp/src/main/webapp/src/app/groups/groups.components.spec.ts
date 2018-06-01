import { async, TestBed } from '@angular/core/testing';
import { GroupsComponent } from './groups.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { GroupService } from './group.service';
import { of } from 'rxjs/observable/of';

let mockGroups = [
  { name: 'advanced mathematics' },
  { name: 'advanced english' },
  { name: 'intermediate math' },
  { name: 'geometry group' },
  { name: 'basic MATH' },
  { name: 'g6' },
  { name: 'g7' },
  { name: 'g8' },
  { name: 'g9' },
  { name: 'g10' },
  { name: 'g11' },
];

describe('GroupComponents', () => {
  var fixture, component;
  let mockGroupService = {
    getGroups: () => of(mockGroups)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        DataTableModule,
        SharedModule,
        RouterModule.forRoot([]),
        HttpModule
      ],
      declarations: [ GroupsComponent, TestComponentWrapper ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: GroupService, useValue: mockGroupService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;
    fixture.detectChanges();
  });

  describe('Search Groups', () => {

    it('should search groups that starts with', async(() => {
      setSearchValue('adv');
      expect(component.filteredGroups.length).toBe(2);
    }));

    it('should search and match any part of the string', async(() => {
      setSearchValue('eng');
      expect(component.filteredGroups.length).toBe(1);
    }));

    it('should search and not be case sensitive', async(() => {
      setSearchValue('math');
      expect(component.filteredGroups.length).toBe(3);
    }));

    function setSearchValue(value: string) {
      let input = fixture.debugElement.query(By.css('#search')).nativeElement;

      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<groups></groups>'
})
class TestComponentWrapper {
  groups = mockGroups;
}
