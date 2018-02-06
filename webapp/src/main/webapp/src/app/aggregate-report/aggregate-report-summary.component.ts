import { Component, Input } from "@angular/core";

const valueToOptionText = attribute => value => attribute.options.find(option => option.value === value).text;

@Component({
  selector: 'aggregate-report-summary',
  templateUrl: './aggregate-report-summary.component.html',
})
export class AggregateReportSummary {

  @Input()
  columns: Column[];

  summarizeSelection(attribute: Attribute): boolean {
    return attribute.options
      && attribute.options.length > 1
      && attribute.options.length === attribute.values.length;
  }

  getValues(attribute: Attribute): string[] {
    return (
      attribute.valueMapper
        ? attribute.values.map(attribute.valueMapper(attribute))
        : attribute.options
          ? attribute.values.map(valueToOptionText(attribute))
          : attribute.values
    ).filter(value => typeof value !== 'undefined');
  }

}

export class Column {
  readonly heading?: string;
  readonly label: string;
  readonly labelCssClasses: any;
  readonly scrollElement?: any;
  readonly attributes?: Attribute[];
}

export class Attribute {
  readonly label: string;
  readonly options: any[];
  readonly values: any[];
  readonly valueMapper: (a: Attribute) => (value: any) => any;
}
