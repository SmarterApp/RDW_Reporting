import { Assessment } from "./assessment.model";
import { Exam } from "./exam.model";

/**
 * This class represents a collection of Exams for a given Assessment.
 */
export class AssessmentExam {
  assessment: Assessment;
  exams: Exam[];
  collapsed: boolean;

  constructor(){
    this.assessment = new Assessment();
    this.exams = [];
    this.collapsed = false;
  }
}
