import { NgModule } from '@angular/core';
import { TypeaheadModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DistrictTypeahead } from './district-typeahead';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DistrictTypeahead],
  imports: [CommonModule, FormsModule, TranslateModule, TypeaheadModule],
  exports: [DistrictTypeahead]
})
export class DistrictModule {}
