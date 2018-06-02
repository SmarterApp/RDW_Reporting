import { Component, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AggregateReportOptions } from "../aggregate-report-options";
import { AggregateReportFormSettings } from "../aggregate-report-form-settings";
import { AggregateReportFormOptions } from "../aggregate-report-form-options";
import { AggregateReportOptionsMapper } from "../aggregate-report-options.mapper";
import { ScrollNavItem } from "../../shared/nav/scroll-nav.component";

@Component({
  selector: 'aggregate-query-form-container',
  templateUrl: './aggregate-query-form-container.component.html'
})
export class AggregateQueryFormContainerComponent {

  accessDenied: boolean;
  aggregateReportOptions: AggregateReportOptions;
  reportType: string;
  filteredOptions: AggregateReportFormOptions;

  navItems: ScrollNavItem[];
  navItemsByReportType: {[key: string]: ScrollNavItem[]} = {};
  submitActionsByReportType: {[key: string]: EventEmitter<Event>} = {};

  private _globalNavItems: ScrollNavItem[] = [{
    id: 'reportTypeSection',
    translationKey: 'aggregate-report-form.section.report-type-heading'
  }];

  constructor(private optionMapper: AggregateReportOptionsMapper,
              private route: ActivatedRoute) {
    this.aggregateReportOptions = route.snapshot.data[ 'options' ];
    const settings: AggregateReportFormSettings = route.snapshot.data[ 'settings' ];
    this.reportType = settings.reportType;

    const options: AggregateReportFormOptions = optionMapper.map(this.aggregateReportOptions);
    this.filteredOptions = Object.assign({}, options);
    this.filteredOptions.reportTypes.forEach((reportType) => this.submitActionsByReportType[reportType.value] = new EventEmitter());

    this.accessDenied = this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  setNavItems(reportType: string, navItems: ScrollNavItem[]): void {
    navItems = this._globalNavItems.concat(navItems);
    this.navItemsByReportType[reportType] = navItems;
    if (this.reportType === reportType) {
      this.navItems = navItems;
    }
  }

  onReportTypeChange(): void {
    this.navItems = this.navItemsByReportType[this.reportType] || [];
  }

  submitQuery($event): void {
    this.submitActionsByReportType[this.reportType].emit($event);
  }
}
