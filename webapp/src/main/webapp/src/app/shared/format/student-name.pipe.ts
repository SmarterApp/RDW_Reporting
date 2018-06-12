import { Pipe, PipeTransform } from "@angular/core";
import { Student } from '../../student/model/student.model';
import { StudentNameService } from './student-name.service';

@Pipe({ name: 'studentName' })
export class StudentNamePipe implements PipeTransform {

  constructor(private studentNameService: StudentNameService) {
  }

  transform(value: Student): string {
    return this.studentNameService.getDisplayName(value);
  }
}

