import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { PopoverModule } from "ngx-bootstrap/popover";
import { Angulartics2Module } from "angulartics2";
import { GroupImportComponent } from "./group-import.component";
import { GroupImportService } from "./group-import.service";
import { FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "../../shared/common.module";
import { ImportHistoryComponent } from "./history/import-history.component";
import { ImportHistoryResolve } from "./history/import-history.resolve";
import { ImportTableComponent } from './import-table/import-table.component';
import { GroupImportDeactivateGuard } from "./group-import.deactivate";

@NgModule({
  declarations: [
    GroupImportComponent,
    ImportHistoryComponent,
    ImportTableComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataTableModule,
    SharedModule,
    PopoverModule,
    FileUploadModule,
    Angulartics2Module.forChild()
  ],
  exports: [ GroupImportComponent ],
  providers: [ GroupImportService, ImportHistoryResolve, GroupImportDeactivateGuard ]
})

export class GroupImportModule {
}
