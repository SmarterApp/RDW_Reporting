import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTableComponent } from './import-table.component';
import { CommonModule } from "../../../shared/common.module";
import { DataTableModule } from "primeng/components/datatable/datatable";

describe('ImportTableComponent', () => {
  let component: ImportTableComponent;
  let fixture: ComponentFixture<ImportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule, DataTableModule ],
      declarations: [ ImportTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
