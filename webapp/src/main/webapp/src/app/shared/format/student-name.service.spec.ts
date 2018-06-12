import { async } from "@angular/core/testing";
import { StudentNameService } from './student-name.service';
import { TranslateService } from '@ngx-translate/core';
import { Student } from '../../student/model/student.model';
import Spy = jasmine.Spy;

describe('SchoolYearPipe', () => {
  let target: StudentNameService;
  let translateService;

  beforeEach(async(() => {

    translateService = jasmine.createSpyObj('TranslateService', [
      'instant'
    ]);

    target = new StudentNameService(translateService);

  }));

  it('should return null for null student', async(() => {
    let actual = target.getDisplayName(null);

    expect(actual).toBeNull();
  }));

  it('should return ssid for null first and last name', async(() => {
    let actual = target.getDisplayName(<Student>{ssid: 'SSID1', firstName: null, lastName: null});

    expect(actual).toEqual('SSID1');
  }));

  it('should return ssid for missing first and last name', async(() => {
    let actual = target.getDisplayName(<Student>{ssid: 'SSID1'});

    expect(actual).toEqual('SSID1');
  }));

  it('should return translation for student with first and last name', async(() => {
    let student = <Student>{ssid: 'SSID1', firstName: 'first', lastName: 'last'};
    let expectedDisplayName = student.lastName + ', ' + student.firstName;

    (translateService.instant as Spy).and.callFake(() => expectedDisplayName);
    let actual = target.getDisplayName(student);

    expect(actual).toEqual(expectedDisplayName);
  }));

  it('should return translation for student with only last name', async(() => {
    let student = <Student>{ssid: 'SSID1', lastName: 'last'};
    let expectedDisplayName = student.lastName + ', ' + student.firstName;

    (translateService.instant as Spy).and.callFake(() => expectedDisplayName);
    let actual = target.getDisplayName(student);

    expect(actual).toEqual(expectedDisplayName);
  }));

  it('should return translation for student with only first name', async(() => {
    let student = <Student>{ssid: 'SSID1', firstName: 'first'};
    let expectedDisplayName = student.lastName + ', ' + student.firstName;

    (translateService.instant as Spy).and.callFake(() => expectedDisplayName);
    let actual = target.getDisplayName(student);

    expect(actual).toEqual(expectedDisplayName);
  }));

});
