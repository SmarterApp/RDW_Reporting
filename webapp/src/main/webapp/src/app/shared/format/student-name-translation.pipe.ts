import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../../student/model/student.model';
import { StudentNameService } from './student-name.service';

@Pipe({ name: 'studentNameTranslation' })
export class StudentNameTranslationPipe implements PipeTransform {

  constructor(private studentNameService: StudentNameService) {
  }

  transform(key: string, value: Student): string {
    return this.studentNameService.getTranslation(key, value);
  }
}

