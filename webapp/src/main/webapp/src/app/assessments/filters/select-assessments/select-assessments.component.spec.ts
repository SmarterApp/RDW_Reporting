import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssessmentsComponent } from './select-assessments.component';
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "../../../shared/common.module";
import { Assessment } from "../../model/assessment.model";
import { Angulartics2Module } from 'angulartics2';

describe('SelectAssessmentsComponent', () => {
  let component: SelectAssessmentsComponent;
  let fixture: ComponentFixture<SelectAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAssessmentsComponent ],
      imports: [ HttpModule, FormsModule, CommonModule, Angulartics2Module ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should group assessments by grade', ()=> {
    let assessments = [
      { grade: '03', name: "asmt1" },
      { grade: '03', name: "asmt2" },
      { grade: '04', name: "asmt3" },
      { grade: '05', name: "asmt4" },
      { grade: '05', name: "asmt5" },
    ].map(x =>{
      let asmt = new Assessment();
      asmt.grade = x.grade;
      asmt.name = x.name;
      return asmt;
    });

    component.assessments = assessments;

    let actual = component.assessmentsByGrade;

    expect(actual[0].grade).toBe('03');
    expect(actual[0].assessments.length).toBe(2);

    expect(actual[1].grade).toBe('04');
    expect(actual[1].assessments.length).toBe(1);

    expect(actual[2].grade).toBe('05');
    expect(actual[2].assessments.length).toBe(2);
  })
});
