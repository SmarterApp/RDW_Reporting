import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "primeng/primeng";
import { PopoverModule } from "ngx-bootstrap/popover";
import { Angulartics2Module } from "angulartics2";
import { GroupImportComponent } from "./group-import.component";
import { GroupImportService } from "./group-import.service";
import { FileUploadModule } from "ng2-file-upload";
import { ImportHistoryComponent } from "./history/import-history.component";
import { ImportHistoryResolve } from "./history/import-history.resolve";
import { ImportTableComponent } from './import-table/import-table.component';
import { GroupImportDeactivateGuard } from "./group-import.deactivate";
import { CommonModule } from "../../../shared/common.module";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [
    GroupImportComponent,
    ImportHistoryComponent,
    ImportTableComponent
  ],
  imports: [
    Angulartics2Module.forChild(),
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FileUploadModule,
    FormsModule,
    PopoverModule,
    SharedModule,
    TableModule
  ],
  exports: [ GroupImportComponent ],
  providers: [ GroupImportService, ImportHistoryResolve, GroupImportDeactivateGuard ]
})

export class GroupImportModule {
}
