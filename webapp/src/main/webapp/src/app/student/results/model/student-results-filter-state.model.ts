import { FilterBy } from "../../../assessments/model/filter-by.model";
export class StudentResultsFilterState {

  public years: number[];
  public schoolYear: number = 0;
  public subjects: string[];
  public subject: string = "";

  public filterBy: FilterBy = new FilterBy();

}
