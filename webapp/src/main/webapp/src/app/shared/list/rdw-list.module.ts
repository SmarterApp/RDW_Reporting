import { NgModule } from '@angular/core';
import { ListGroupComponent } from './list-group.component';
import { EditableListGroupComponent } from './editable-list-group.component';
import { BrowserModule } from '@angular/platform-browser';
import { ActionableListGroupComponent } from './actionable-list-group.component';

@NgModule({
  declarations: [
    ActionableListGroupComponent,
    EditableListGroupComponent,
    ListGroupComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    ActionableListGroupComponent,
    EditableListGroupComponent,
    ListGroupComponent
  ]
})
export class RdwListModule {

}
