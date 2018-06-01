import { NgModule } from '@angular/core';
import { FilterOptionsService } from './filter-options.service';
import { StudentFiltersComponent } from './student-filters.component';
import { RdwFormModule } from '../form/rdw-form.module';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentFilterFormOptionsMapper } from './student-filter-form-options.mapper';

@NgModule({
  declarations: [
    StudentFiltersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RdwFormModule,
    TranslateModule.forRoot()
  ],
  exports: [
    StudentFiltersComponent
  ],
  providers: [
    FilterOptionsService,
    StudentFilterFormOptionsMapper
  ]
})
export class RdwFilterModule {

}
