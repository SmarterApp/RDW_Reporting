import { Component, OnInit } from "@angular/core";
import { ImportResult } from "../import-result.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'import-history',
  templateUrl: './import-history.component.html'
})
export class ImportHistoryComponent implements OnInit {

  imports: ImportResult[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.imports = this.route.snapshot.data[ "imports" ];
  }

}
