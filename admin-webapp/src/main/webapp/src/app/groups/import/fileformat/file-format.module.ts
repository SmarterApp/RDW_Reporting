import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { FileFormatComponent } from "./file-format.component";
import { SharedModule } from "primeng/components/common/shared";
import { CommonModule } from "../../../shared/common.module";
import { FileFormatService } from "./file-format.service";

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
