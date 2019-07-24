import { TranslateService } from '@ngx-translate/core';
import { ValidatorFn } from '@angular/forms';

/**
 * The different field data types
 */
export type PropertyDataType =
  | 'string'
  | 'boolean'
  | 'integer'
  | 'float'
  | 'enumeration'
  | 'enumeration-list'
  | 'uri'
  | 'url'
  | 'url-fragment'
  | 'password'
  | 'username'
  | 'database';

export type InputType = 'input' | 'checkbox' | 'select' | 'multi-select';

export interface Option<T = any> {
  /**
   * The option value
   */
  value: T;

  /**
   * The option display name
   */
  label?: string;
}

/**
 * Provides options for lists and map data types
 */
export interface OptionsProvider<T = any> {
  (translateService: TranslateService): Option<T>[];
}

export interface Equals<T = any> {
  (a: T, b: T): boolean;
}

/**
 * The configuration for a form field
 */
export interface FieldConfiguration<DataTypes = any, T = any> {
  /**
   * The data type of the field
   */
  dataType: DataTypes;

  /**
   * This method should provide the possible values of enumerated data types
   *
   * @param translateService The service used to translate the value into a display label
   */
  options?: OptionsProvider<T>;

  /**
   * Set this if the field is required
   */
  required?: boolean;

  /**
   * lowercase constraint
   */
  lowercase?: boolean;

  /**
   * Used to provide leniency when comparing values for enumerations
   */
  equals?: Equals<T>;
}

/**
 * The computed field metadata based on the configuration
 */
export interface Field<DataTypes = any, T = any> {
  configuration: FieldConfiguration<DataTypes, T>;

  /**
   * The actual form input to use
   */
  inputType: InputType;

  /**
   * The field-specific validators
   */
  validators: ValidatorFn[];

  /**
   * The possible values of the field if it is a list or map
   */
  options?: Option<T>[];
}