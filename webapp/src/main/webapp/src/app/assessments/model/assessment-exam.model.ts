import { Assessment } from './assessment.model';
import { Exam } from './exam.model';

/**
 * TODO make this an interface once the collapsed field is removed
 *
 * This class represents a collection of Exams for a given Assessment.
 */
export class AssessmentExam {
  assessment: Assessment;
  exams: Exam[];
  /** @deprecated TODO move to view-specific wrapper */ collapsed: boolean;

  constructor() {
    this.assessment = new Assessment();
    this.exams = [];
    this.collapsed = false;
  }
}
