import { Component, Input } from "@angular/core";
import { Percentile } from "./assessment-percentile";
import { Utils } from "../../shared/support/support";

@Component({
  selector: 'assessment-percentile-table',
  templateUrl: 'assessment-percentile-table.component.html',
  host: {
    'class': 'assessment-percentile-table'
  }
})
export class AssessmentPercentileTable {

  columns: Column[];

  private _percentiles: Percentile[];

  get percentiles(): Percentile[] {
    return this._percentiles;
  }

  @Input()
  set percentiles(percentiles: Percentile[]) {
    if (this.percentiles === percentiles) {
      return;
    }
    if (Utils.isNullOrEmpty(percentiles)) {
      throw new Error('percentiles must not be undefined or empty');
    }
    this._percentiles = percentiles;
    this.columns = this.createColumns(percentiles);
  }

  private createColumns(percentiles: Percentile[]): Column[] {
    const first = percentiles[0];
    return [
      { headerTranslationCode: 'assessment-percentile-table.column.effective-date.header', field: 'startDate' },
      { headerTranslationCode: 'assessment-percentile-table.column.count', field: 'count' },
      { headerTranslationCode: 'assessment-percentile-table.column.mean', field: 'mean' },
      { headerTranslationCode: 'assessment-percentile-table.column.standard-deviation', field: 'standardDeviation' },
      ...first.scores.map((score, index) => <Column>{
        header: score.rank, field: index
      })
    ];
  }

}

interface Column {
  headerTranslationCode?: string;
  header?: any;
  field: any;
}
