import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";

/**
 * Represents the data necessary to present and store changes to the aggregate report form
 */
export interface AggregateReportForm {

  /**
   * The options available for selection
   */
  readonly options: AggregateReportFormOptions;

  /**
   * The current selection of available options
   */
  readonly settings: AggregateReportFormSettings;

}
