import { OnInit, Component } from "@angular/core";
import { saveAs } from "file-saver";
import { Report } from "./report.model";
import { ActivatedRoute } from "@angular/router";

/**
 * Responsible for controlling the behavior of the reports page
 */
@Component({
  selector: 'reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

  public reports: Report[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.reports = this.route.snapshot.data[ 'reports' ];
  }

}
