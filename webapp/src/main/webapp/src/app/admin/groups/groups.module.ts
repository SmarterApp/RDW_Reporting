import { NgModule } from "@angular/core";
import { GroupsComponent } from "./groups.component";
import { GroupService } from "./groups.service";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap";
import { DeleteGroupModalComponent } from "./delete-group.modal";
import { DropdownModule } from 'primeng/primeng';
import { CommonModule } from "../../shared/common.module";
import { TableModule } from "primeng/table";

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
    DropdownModule,
    FormsModule,
    ModalModule.forRoot(),
    TableModule
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
