import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionalResourceComponent } from "./instructional-resource.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InstructionalResourceComponent
  ],
  exports: [
    InstructionalResourceComponent
  ]
})
export class InstructionalResourceModule {
}
