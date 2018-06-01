import { StudentFilterOptions } from './student-filter-options';
import { StudentFilterFormOptions } from './student-filter-form-options';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DisplayOptionService } from '../display-options/display-option.service';

@Injectable()
export class StudentFilterFormOptionsMapper {

  constructor(private displayOptionService: DisplayOptionService,
              private translateService: TranslateService) {
  }

  fromOptions(options: StudentFilterOptions): StudentFilterFormOptions {

    const optionMapper = this.displayOptionService.createOptionMapper;
    const translate = code => this.translateService.instant(code);

    return <StudentFilterFormOptions>{
      genders: options.genders.map(optionMapper(
        value => translate(`common.gender.${value}`),
        value => `Gender: ${value}`
      )),
      ethnicities: options.ethnicities.map(optionMapper(
        value => translate(`common.ethnicity.${value}`),
        value => `Ethnicity: ${value}`
      )),
      englishLanguageAcquisitionStatuses: options.englishLanguageAcquisitionStatuses.map(optionMapper(
        value => translate(`common.elas.${value}`),
        value => `English Language Acquisition Status: ${value}`
      )),
      individualEducationPlans: options.individualEducationPlans.map(optionMapper(
        value => translate(`common.strict-boolean.${value}`),
        value => `Individual Education Plan: ${value}`
      )),
      limitedEnglishProficiencies: options.limitedEnglishProficiencies.map(optionMapper(
        value => translate(`common.boolean.${value}`),
        value => `Limited English Proficiency: ${value}`
      )),
      section504s: options.section504s.map(optionMapper(
        value => translate(`common.boolean.${value}`),
        value => `Section 504: ${value}`
      )),
      migrantStatuses: options.migrantStatuses.map(optionMapper(
        value => translate(`common.boolean.${value}`),
        value => `Migrant Status: ${value}`
      ))
    };
  }

}
