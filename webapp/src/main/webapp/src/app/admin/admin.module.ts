import { NgModule } from "@angular/core";
import { GroupImportModule } from "./groups/import/group-import.module";
import { GroupsModule } from "./groups/groups.module";
import { FileFormatModule } from "./groups/import/fileformat/file-format.module";
import { InstructionalResourceModule } from "./instructional-resource/instructional-resource.module";
import { HomeComponent } from "./home/home.component";
import { EmbargoModule } from "./embargo/embargo.module";
import { CommonModule } from "../shared/common.module";

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    GroupImportModule,
    GroupsModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule
  ],
  exports: [
    GroupImportModule,
    GroupsModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule,
    HomeComponent
  ],
  providers: []
})
export class AdminModule {

}
