import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { FileFormatComponent } from "./file-format.component";
import { SharedModule } from "primeng/components/common/shared";
import { FileFormatService } from "./file-format.service";
import { CommonModule } from "../../../../shared/common.module";

@NgModule({
  declarations: [
    FileFormatComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    FileFormatComponent
  ],
  providers: [
    FileFormatService
  ]
})
export class FileFormatModule {
}
