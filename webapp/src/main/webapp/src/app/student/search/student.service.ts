import { Injectable } from '@angular/core';
import { DataService } from '../../shared/data/data.service';
import { ReportingServiceRoute } from '../../shared/service-route';
import { Student } from './student';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

export interface StudentSearch {
  schoolId?: number;
  groupId?: number;
}


@Injectable()
export class StudentService {

  constructor(private dataService: DataService) {
  }

  getStudents(search: StudentSearch): Observable<Student[]> {
    return this.dataService.get(`${ReportingServiceRoute}/students`, {
      params: <any>search
    }).pipe(
      map(serverStudents => serverStudents.map(serverStudent => <Student>{
        id: serverStudent.id,
        ssid: serverStudent.ssid,
        firstName: serverStudent.firstName,
        lastName: serverStudent.lastName,
        gender: serverStudent.genderCode,
        ethnicities: serverStudent.ethnicityCodes,
        englishLanguageAcquisitionStatus: serverStudent.englishLanguageAcquisitionStatusCode,
        individualEducationPlan: this.toBooleanCode(serverStudent.individualEducationPlan),
        limitedEnglishProficiency: this.toBooleanCode(serverStudent.limitedEnglishProficiency),
        section504: this.toBooleanCode(serverStudent.section504),
        migrantStatus: this.toBooleanCode(serverStudent.migrantStatus)
      }))
    );
  }

  /**
   * TODO move to API repository layer
   *
   * Converts javascript booleans into string boolean codes
   *
   * @param {boolean} value
   * @returns {string}
   */
  private toBooleanCode(value?: boolean): string {
    if (value == null) {
      return 'undefined';
    }
    return value ? 'yes' : 'no';
  }

}
