import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportTableComponent } from './import-table.component';
import { CommonModule } from "../../../../shared/common.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('ImportTableComponent', () => {
  let component: ImportTableComponent;
  let fixture: ComponentFixture<ImportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImportTableComponent
      ],
      imports: [
        CommonModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
