import { NgModule } from '@angular/core';
import { SubgroupMapper } from './subgroup.mapper';
import { SubgroupComponent } from './subgroup.component';
import { SubgroupFiltersComponent } from './subgroup-filters.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../shared/common.module';

@NgModule({
  declarations: [
    SubgroupComponent,
    SubgroupFiltersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    SubgroupComponent,
    SubgroupFiltersComponent
  ],
  providers: [
    SubgroupMapper
  ]
})
export class SubgroupModule {

}
