import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportHistoryComponent } from './import-history.component';
import { ImportTableComponent } from "../import-table/import-table.component";
import { CommonModule } from "../../../shared/common.module";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { ActivatedRoute } from "@angular/router";

describe('ImportHistoryComponent', () => {
  let component: ImportHistoryComponent;
  let fixture: ComponentFixture<ImportHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule, DataTableModule  ],
      declarations: [ ImportHistoryComponent, ImportTableComponent ],
      providers: [ {
          provide: ActivatedRoute,
          useValue: { snapshot: { data : { imports: [] }  } }
        }
      ]
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
