import { FilterBy } from "./filter-by.model";

describe('FilterBy model', () =>{

  it('should detect changes to offGradeAssessment', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('offGradeAssessment');
      actual = true;
    });

    fixture.offGradeAssessment = true;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to administration', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('administration');
      actual = true;
    });

    fixture.administration = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to summativeStatus', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('summativeStatus');
      actual = true;
    });

    fixture.summativeStatus = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to completion', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('completion');
      actual = true;
    });

    fixture.completion = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to gender', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('gender');
      actual = true;
    });

    fixture.gender = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to migrantStatus', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('migrantStatus');
      actual = true;
    });

    fixture.migrantStatus = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to plan504', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('plan504');
      actual = true;
    });

    fixture.plan504 = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to iep', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('iep');
      actual = true;
    });

    fixture.iep = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to economicDisadvantage', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('economicDisadvantage');
      actual = true;
    });

    fixture.economicDisadvantage = 1;
    expect(actual).toBeTruthy();
  });

  it('should detect changes to limitedEnglishProficiency', () =>{
    let fixture = new FilterBy();
    let actual = false;
    fixture.onChanges.subscribe(property => {
      expect(property).toBe('limitedEnglishProficiency');
      actual = true;
    });

    fixture.limitedEnglishProficiency = 1;
    expect(actual).toBeTruthy();
  });

  it('should return only selected filters', () => {
    let fixture = new FilterBy();
    fixture.administration = 1;
    fixture.plan504 = 1;
    fixture.gender = 1;

    expect(fixture.all.length).toBe(3);
    expect(fixture.all).toContain('administration');
    expect(fixture.all).toContain('plan504');
    expect(fixture.all).toContain('gender');
  });

  it('should return all selected filters', () => {
    let fixture = new FilterBy();
    fixture.offGradeAssessment = true;
    fixture.administration = 1;
    fixture.summativeStatus = 1;
    fixture.completion = 2;
    fixture.gender = 1;
    fixture.migrantStatus = 1;
    fixture.plan504 = 2;
    fixture.iep = 1;
    fixture.economicDisadvantage = 1;
    fixture.limitedEnglishProficiency = 2;
    fixture.ethnicities[3] = true;

    expect(fixture.all.length).toBe(11);
    expect(fixture.all).toContain('offGradeAssessment');
    expect(fixture.all).toContain('administration');
    expect(fixture.all).toContain('summativeStatus');
    expect(fixture.all).toContain('completion');
    expect(fixture.all).toContain('gender');
    expect(fixture.all).toContain('migrantStatus');
    expect(fixture.all).toContain('plan504');
    expect(fixture.all).toContain('iep');
    expect(fixture.all).toContain('economicDisadvantage');
    expect(fixture.all).toContain('limitedEnglishProficiency');
    expect(fixture.all).toContain('filteredEthnicities');
  });

  it('should return only selected ethnicities', () =>{
    let fixture = new FilterBy();
    fixture.ethnicities[2] = true;
    fixture.ethnicities[3] = true;
    fixture.ethnicities[1] = true;

    expect(fixture.filteredEthnicities.length).toBe(3);
    expect(fixture.filteredEthnicities).toContain(1);
    expect(fixture.filteredEthnicities).toContain(2);
    expect(fixture.filteredEthnicities).toContain(3);
  })
});
