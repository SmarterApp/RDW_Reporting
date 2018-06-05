import { Component, Input } from "@angular/core";
import { AggregateReportTable } from "./aggregate-report-table.component";
import { AggregateReportItem } from "./aggregate-report-item";

@Component({
  selector: 'aggregate-target-overview',
  templateUrl: 'aggregate-target-overview.component.html'
})
export class AggregateTargetOverviewComponent {

  @Input()
  set table(value: AggregateReportTable) {
    this.overallRow = value.rows.find(row => row.subgroup.dimensionGroups[0].type === "Overall");
    console.log("overallRow", this.overallRow);
  }

  overallRow: AggregateReportItem;
}
