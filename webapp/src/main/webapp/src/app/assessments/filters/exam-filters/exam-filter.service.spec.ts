import { ExamFilterService } from "./exam-filter.service";
import { AdministrativeCondition } from "../../../shared/enum/administrative-condition.enum";
import { Completeness } from "../../../shared/enum/completeness.enum";
import { AssessmentExam } from "../../model/assessment-exam.model";
import { FilterBy } from "../../model/filter-by.model";
import { Assessment } from "../../model/assessment.model";
import { Exam } from "../../model/exam.model";
import { Student } from "../../../student/model/student.model";

describe('ExamFilterService', () => {
  let assessmentExam: AssessmentExam;
  let filterBy: FilterBy;
  let fixture: ExamFilterService;

  beforeEach(() => {
    filterBy = new FilterBy();

    assessmentExam = new AssessmentExam();
    assessmentExam.assessment = new Assessment();
    assessmentExam.exams = [
      buildExam(0),
      buildExam(1),
      buildExam(2),
      buildExam(3)
    ];

    fixture = new ExamFilterService();
  });

  it('should filter exams by Administrative condition for IABs', () => {
    filterBy.administration = AdministrativeCondition.Standard;
    assessmentExam.assessment.type = 'iab';

    assessmentExam.exams[ 0 ].administrativeCondition =  AdministrativeCondition.Standard;
    assessmentExam.exams[ 1 ].administrativeCondition = AdministrativeCondition.NonStandard;
    assessmentExam.exams[ 2 ].administrativeCondition = AdministrativeCondition.Standard;
    assessmentExam.exams[ 3 ].administrativeCondition = AdministrativeCondition.NonStandard;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.administrativeCondition == AdministrativeCondition.NonStandard)).toBeFalsy();
  });

  it('should not filter exams by Administrative condition for Summative', () => {
    filterBy.administration = AdministrativeCondition.Standard;
    assessmentExam.assessment.type = 'sum';

    assessmentExam.exams[ 0 ].administrativeCondition = AdministrativeCondition.Standard;
    assessmentExam.exams[ 1 ].administrativeCondition = AdministrativeCondition.NonStandard;
    assessmentExam.exams[ 2 ].administrativeCondition = AdministrativeCondition.Standard;
    assessmentExam.exams[ 3 ].administrativeCondition = AdministrativeCondition.NonStandard;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.administrativeCondition == AdministrativeCondition.NonStandard)).toBeTruthy();
  });

  it('should filter exams by summative status for Summative', () => {
    filterBy.summativeStatus = AdministrativeCondition.Valid;
    assessmentExam.assessment.type = 'sum';

    assessmentExam.exams[ 0 ].administrativeCondition = AdministrativeCondition.Valid;
    assessmentExam.exams[ 1 ].administrativeCondition = AdministrativeCondition.Invalid;
    assessmentExam.exams[ 2 ].administrativeCondition = AdministrativeCondition.Valid;
    assessmentExam.exams[ 3 ].administrativeCondition = AdministrativeCondition.Invalid;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.administrativeCondition == AdministrativeCondition.Invalid)).toBeFalsy();
  });

  it('should not filter exams by summative status for IABs', () => {
    filterBy.summativeStatus = AdministrativeCondition.Valid;
    assessmentExam.assessment.type = 'iab';

    assessmentExam.exams[ 0 ].administrativeCondition = AdministrativeCondition.Valid;
    assessmentExam.exams[ 1 ].administrativeCondition = AdministrativeCondition.Invalid;
    assessmentExam.exams[ 2 ].administrativeCondition = AdministrativeCondition.Valid;
    assessmentExam.exams[ 3 ].administrativeCondition = AdministrativeCondition.Invalid;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.administrativeCondition == AdministrativeCondition.Invalid)).toBeTruthy();
  });

  it('should filter exams by completeness', () => {
    filterBy.completion = Completeness.Partial;

    assessmentExam.exams[ 0 ].completeness = Completeness.Partial;
    assessmentExam.exams[ 1 ].completeness = Completeness.Complete;
    assessmentExam.exams[ 2 ].completeness = Completeness.Partial;
    assessmentExam.exams[ 3 ].completeness = Completeness.Complete;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.completeness == Completeness.Complete)).toBeFalsy();
  });

  it('should hide off-grade when offGradeAssessment is true', () => {
    filterBy.offGradeAssessment = true;

    assessmentExam.assessment.grade = '02';

    assessmentExam.exams[ 0 ].enrolledGrade = '02';
    assessmentExam.exams[ 1 ].enrolledGrade = '03';
    assessmentExam.exams[ 2 ].enrolledGrade = '02';
    assessmentExam.exams[ 3 ].enrolledGrade = '03';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.enrolledGrade == '03')).toBeFalsy();
  });

  it('should show off-grade when offGradeAssessment is false', () => {
    filterBy.offGradeAssessment = false;

    assessmentExam.assessment.grade = '02';

    assessmentExam.exams[ 0 ].enrolledGrade = '02';
    assessmentExam.exams[ 1 ].enrolledGrade = '03';
    assessmentExam.exams[ 2 ].enrolledGrade = '02';
    assessmentExam.exams[ 3 ].enrolledGrade = '03';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(4);
    expect(actual.some(x => x.enrolledGrade == '03')).toBeTruthy();
  });

  it('should filter by completeness, off-grade, and summative status', () => {
    filterBy.offGradeAssessment = true;
    filterBy.summativeStatus = AdministrativeCondition.Standard;
    filterBy.completion = Completeness.Partial;

    assessmentExam.assessment.grade = '03';

    // only completeness matches criteria.
    assessmentExam.exams[ 0 ].enrolledGrade = '02';
    assessmentExam.exams[ 0 ].administrativeCondition = AdministrativeCondition.Valid;
    assessmentExam.exams[ 0 ].completeness = Completeness.Partial;

    // all fields match parameters, should return.
    assessmentExam.exams[ 1 ].enrolledGrade = '03';
    assessmentExam.exams[ 1 ].administrativeCondition = AdministrativeCondition.Standard;
    assessmentExam.exams[ 1 ].completeness = Completeness.Partial;

    // all fields but completeness match criteria, should not return.
    assessmentExam.exams[ 2 ].enrolledGrade = '03';
    assessmentExam.exams[ 2 ].administrativeCondition = AdministrativeCondition.Standard;
    assessmentExam.exams[ 2 ].completeness = Completeness.Complete;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);

    expect(actual.some(x => x.enrolledGrade == '02')).toBeFalsy();
    expect(actual.some(x => x.administrativeCondition == AdministrativeCondition.Valid)).toBeFalsy();
    expect(actual.some(x => x.completeness == Completeness.Complete)).toBeFalsy();
  });

  it('should filter exams by gender', () => {
    filterBy.genders["Male"] = false;
    filterBy.genders["Female"] = true;
    filterBy.genders["Nonbinary"] = true;

    assessmentExam.exams[ 0 ].student.genderCode = 'Female';
    assessmentExam.exams[ 1 ].student.genderCode = 'Male';
    assessmentExam.exams[ 2 ].student.genderCode = 'Female';
    assessmentExam.exams[ 3 ].student.genderCode = 'Nonbinary';

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(3);
    expect(actual.some(x => x.student.genderCode == 'Male')).toBeFalsy();
  });

  it('should filter exams by migrant status as Yes', () => {
    filterBy.migrantStatus = 1;

    assessmentExam.exams[ 0 ].migrantStatus = true;
    assessmentExam.exams[ 1 ].migrantStatus = false;
    assessmentExam.exams[ 2 ].migrantStatus = undefined;
    assessmentExam.exams[ 3 ].migrantStatus = undefined;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);
    expect(actual.some(x => x.migrantStatus === true)).toBeTruthy();
    expect(actual.some(x => x.migrantStatus === false)).toBeFalsy();
    expect(actual.some(x => x.migrantStatus == null)).toBeFalsy();
  });

  it('should filter exams by migrant status as No', () => {
    filterBy.migrantStatus = 2;

    assessmentExam.exams[ 0 ].migrantStatus = true;
    assessmentExam.exams[ 1 ].migrantStatus = false;
    assessmentExam.exams[ 2 ].migrantStatus = undefined;
    assessmentExam.exams[ 3 ].migrantStatus = undefined;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);
    expect(actual.some(x => x.migrantStatus === false)).toBeTruthy();
    expect(actual.some(x => x.migrantStatus === true)).toBeFalsy();
    expect(actual.some(x => x.migrantStatus == null)).toBeFalsy();
  });

  it('should filter exams by 504 plan', () => {
    filterBy.plan504 = 2;

    assessmentExam.exams[ 0 ].plan504 = true;
    assessmentExam.exams[ 1 ].plan504 = false;
    assessmentExam.exams[ 2 ].plan504 = false;
    assessmentExam.exams[ 3 ].plan504 = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(3);
    expect(actual.some(x => x.plan504 === false)).toBeTruthy();
    expect(actual.some(x => x.plan504 === true)).toBeFalsy();
  });

  it('should filter exams by IEP', () => {
    filterBy.iep = 1;

    assessmentExam.exams[ 0 ].iep = true;
    assessmentExam.exams[ 1 ].iep = false;
    assessmentExam.exams[ 2 ].iep = false;
    assessmentExam.exams[ 3 ].iep = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(1);
    expect(actual.some(x => x.iep === true)).toBeTruthy();
    expect(actual.some(x => x.iep === false)).toBeFalsy();
  });

  it('should filter exams by Limited English Proficiency', () => {
    filterBy.limitedEnglishProficiency = 2;

    assessmentExam.exams[ 0 ].limitedEnglishProficiency = true;
    assessmentExam.exams[ 1 ].limitedEnglishProficiency = false;
    assessmentExam.exams[ 2 ].limitedEnglishProficiency = false;
    assessmentExam.exams[ 3 ].limitedEnglishProficiency = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(3);
    expect(actual.some(x => x.limitedEnglishProficiency === false)).toBeTruthy();
    expect(actual.some(x => x.limitedEnglishProficiency === true)).toBeFalsy();
  });

  it('should filter exams by ethnicities', () => {
    filterBy.ethnicities["Filipino"] = true;
    filterBy.ethnicities["Asian"] = true;
    filterBy.ethnicities["BlackOrAfricanAmerican"] = true;

    assessmentExam.exams[ 0 ].student.ethnicityCodes = [ "Filipino", "White"];
    assessmentExam.exams[ 1 ].student.ethnicityCodes = [ "White"] ;
    assessmentExam.exams[ 2 ].student.ethnicityCodes = [ "Asian" ];
    assessmentExam.exams[ 3 ].student.ethnicityCodes = [ "DemographicRaceTwoOrMoreRaces", "NativeHawaiianOrOtherPacificIslander" ];

    assessmentExam.exams = assessmentExam.exams.map((value, index) => {
      let exam = value;
      exam.session = index.toString();
      return exam;
    });

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.length).toBe(2);
    expect(actual[0].session).toBe("0");
    expect(actual[1].session).toBe("2");
  });

  it('should hide transfer exams when transferAssessment is true', () => {
    filterBy.transferAssessment = true;

    assessmentExam.exams[ 0 ].transfer = false;
    assessmentExam.exams[ 1 ].transfer = true;
    assessmentExam.exams[ 2 ].transfer = true;
    assessmentExam.exams[ 3 ].transfer = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.map(exam => exam.id)).toEqual([0, 3]);
  });

  it('should show transfer exams when transferAssessment is false', () => {
    filterBy.transferAssessment = false;

    assessmentExam.exams[ 0 ].transfer = false;
    assessmentExam.exams[ 1 ].transfer = true;
    assessmentExam.exams[ 2 ].transfer = true;
    assessmentExam.exams[ 3 ].transfer = false;

    let actual = fixture.filterExams(assessmentExam, filterBy);

    expect(actual.map(exam => exam.id)).toEqual([0, 1, 2, 3]);
  });

  function buildExam(id: number): Exam {
    let exam: Exam = new Exam();
    exam.id = id;
    exam.student = new Student();
    return exam;
  }
});
