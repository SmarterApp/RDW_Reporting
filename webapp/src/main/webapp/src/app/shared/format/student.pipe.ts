import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../../student/model/student.model';

@Pipe({ name: 'student' })
export class StudentPipe implements PipeTransform {

  constructor() {
  }

  transform(value: Student, omitLastName?: boolean): string {
    if (value == null) {
      return null;
    }

    if (!value.firstName) {
      return value.ssid;
    }

    if (omitLastName) {
      return value.firstName;
    }

    return `${value.lastName}, ${value.firstName}`;
  }
}

