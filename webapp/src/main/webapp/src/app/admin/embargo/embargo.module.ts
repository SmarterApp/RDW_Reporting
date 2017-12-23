import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EmbargoService } from "./embargo.service";
import { EmbargoComponent } from "./embargo.component";
import { DataTableModule } from "primeng/primeng";
import { ButtonsModule, ModalModule } from "ngx-bootstrap";
import { Toggle } from "./toggle.component";
import { EmbargoTable } from "./embargo-table.component";
import { EmbargoConfirmationModal } from "./embargo-confirmation-modal.component";
import { HttpClientModule } from "@angular/common/http";
import { EmbargoResolve } from "./embargo.resolve";
import { CommonModule } from "../../shared/common.module";

@NgModule({
  declarations: [
    EmbargoComponent,
    EmbargoTable,
    Toggle,
    EmbargoConfirmationModal
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    DataTableModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    EmbargoComponent
  ],
  providers: [
    EmbargoService,
    EmbargoResolve
  ],
  entryComponents: [
    EmbargoConfirmationModal
  ]
})
export class EmbargoModule {
}
