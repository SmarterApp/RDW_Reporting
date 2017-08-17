import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportHistoryComponent } from './import-history.component';

describe('ImportHistoryComponent', () => {
  let component: ImportHistoryComponent;
  let fixture: ComponentFixture<ImportHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
