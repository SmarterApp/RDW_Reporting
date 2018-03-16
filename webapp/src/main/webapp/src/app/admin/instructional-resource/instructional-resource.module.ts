import { NgModule } from '@angular/core';
import { InstructionalResourceComponent } from "./instructional-resource.component";
import { ModalModule, TypeaheadModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CreateInstructionalResourceModal } from "./create-instructional-resource.modal";
import { InstructionalResourceService } from "./instructional-resource.service";
import { AssessmentService } from "./assessment.service";
import { OrganizationService } from "./organization.service";
import { UpdateInstructionalResourceModal } from "./update-instructional-resource.modal";
import { DeleteInstructionalResourceModal } from "./delete-instructional-resource.modal";
import { CommonModule } from "../../shared/common.module";
import { RdwMenuModule } from "../../shared/menu/rdw-menu.module";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [
    CreateInstructionalResourceModal,
    DeleteInstructionalResourceModal,
    InstructionalResourceComponent,
    UpdateInstructionalResourceModal
  ],
  entryComponents: [
    CreateInstructionalResourceModal,
    DeleteInstructionalResourceModal,
    UpdateInstructionalResourceModal
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    RdwMenuModule,
    TableModule,
    TypeaheadModule.forRoot()
  ],
  exports: [
    InstructionalResourceComponent
  ],
  providers: [
    AssessmentService,
    InstructionalResourceService,
    OrganizationService
  ]
})
export class InstructionalResourceModule {
}
