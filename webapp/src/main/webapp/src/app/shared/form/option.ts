/**
 * Represents a generic UI component option available for selection
 */
export interface Option {

  /**
   * The value of the option
   */
  readonly value: any;

  /**
   * Optional display text representative of the option value.
   * If none is provided the value will be displayed directly.
   */
  readonly text?: string;

  /**
   * Optional analytic properties to be passed to the analytics service if the option is chosen
   */
  readonly analyticsProperties?: any;

  /**
   * Optional description to display beneath the option value
   */
  readonly description?: string;

  /**
   * Optional boolean to specify whether or not to disable the option
   */
  readonly disabled?: boolean;

  /**
   * Optional hover over text to display when the option is disabled
   */
  readonly disabledText?: string;

}
