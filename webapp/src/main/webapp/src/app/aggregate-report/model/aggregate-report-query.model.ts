import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { Organization } from "../../admin/instructional-resource/model/organization.model";
import { AssessmentSubjectType } from "../../shared/enum/assessment-subject-type.enum";

/**
 * This model represents an aggregate report query
 */
export class AggregateReportQuery {
  assessmentType: AssessmentType;
  subject: AssessmentSubjectType = -1;
  organizations: Organization[] = [];
  administration: any = -1;
  summativeStatus: any = -1;
  completeness: any = -1;
  gender: any = -1;
  migrantStatus: number = -1;
  plan504: number = -1;
  iep: number = -1;
  economicDisadvantage: number = -1;
  limitedEnglishProficiency: number = -1;
  ethnicities: boolean[] = [ true ];
  assessmentGrades: boolean[] = [ true ];
  schoolYears: boolean[] = [ ];
  achievementLevels: boolean = false;
  showValueAs: boolean = false;

  getAssessmentGradesSelected(): Array<any> {
    let array: Array<any> = [];
    let assessmentGrades = this.assessmentGrades;
    for (let val in assessmentGrades) {
      if (assessmentGrades[ val ]) array.push(val);
    }

    return array;
  }

  getSchoolYears(): any[] {
    let array: any[] = [];
    let schoolYears = this.schoolYears;
    for (let schoolYear in schoolYears) {
      if (schoolYears[ schoolYear ]) array.push(schoolYear);
    }

    return array;
  }

  getSelected(fields: any[]) {
    let array: any[] = [];
    for (let field in fields) {
      if (fields[ field ]) array.push(field);
    }

    return array;
  }

  getSchoolYearsSelected() : number[] {
    let array: number[] = [];
    let schoolYears = this.schoolYears;
    for (let schoolYear in schoolYears) {
      if (schoolYears[ schoolYear ]) array.push(+schoolYear.substring(0, 2).concat(schoolYear.substring(5)));
    }

    return array;
  }
}
