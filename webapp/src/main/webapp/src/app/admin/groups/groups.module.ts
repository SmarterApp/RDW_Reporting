import { NgModule } from "@angular/core";
import { GroupsComponent } from "./groups.component";
import { GroupService } from "./groups.service";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { ModalModule } from "ngx-bootstrap";
import { DeleteGroupModalComponent } from "./delete-group.modal";
import { DropdownModule } from 'primeng/primeng';
import { CommonModule } from "../../shared/common.module";

@NgModule({
  declarations: [
    GroupsComponent,
    DeleteGroupModalComponent
  ],
  entryComponents: [
    DeleteGroupModalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DataTableModule,
    DropdownModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  exports: [
    GroupsComponent
  ],
  providers: [
    GroupService
  ]
})
export class GroupsModule {
}
