import { Exam } from "./exam.model";
export class ExamFilter {
  public name: string;
  public label: string;
  public enumValue: string;
  public apply: (exam: Exam, filterValue: any) => boolean;
  public precondition: (Assessment) => boolean;

  constructor(name: string,
              label: string,
              enumValue: string,
              apply: (exam: Exam, filterValue: any) => boolean,
              precondition: (Assessment) => boolean = () => true) {
    this.name = name;
    this.label = label;
    this.enumValue = enumValue;
    this.apply = apply;
    this.precondition = precondition;
  }
}
