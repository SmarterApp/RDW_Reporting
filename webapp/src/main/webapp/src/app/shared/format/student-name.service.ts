import { Student } from '../../student/model/student.model';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class StudentNameService {
  constructor(private translate: TranslateService) {
  }

  getDisplayName(student: Student) {
    if (student == null) {
      return null;
    }

    if (student.firstName == null && student.lastName == null) {
      return student.ssid;
    }

    return this.translate.instant("common.person-name", student)
  }
}
