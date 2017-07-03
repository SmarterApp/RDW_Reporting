
import { Assessment } from "../../assessments/model/assessment.model";
import { School } from "../../user/model/school.model";
import { Exam } from "../../assessments/model/exam.model";

/**
 * This model represents an exam from a student's history, with associated
 * Assessment and School information.
 */
export class StudentHistoryExamWrapper {

  public get assessment(): Assessment {
    return this._assessment;
  }

  public get exam(): Exam {
    return this._exam;
  }

  public get school(): School {
    return this._school;
  }

  constructor(
    private _assessment: Assessment,
    private _exam: Exam,
    private _school: School
  ) {}
}
