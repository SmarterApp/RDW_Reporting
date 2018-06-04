import { Injectable } from '@angular/core';
import { UserGroup } from '../../user-group/user-group';
import { Group } from '../../groups/group';
import { Option } from './school-and-group-typeahead.component';
import { TranslateService } from '@ngx-translate/core';
import { School } from '../../shared/organization/organization';


@Injectable()
export class SchoolAndGroupTypeaheadOptionMapper {

  constructor(private translateService: TranslateService) {
  }

  createOptions(schoolsAndGroups: any): Option[] {
    const {schools, groups, userGroups} = schoolsAndGroups;
    return [
      ...(schools || []).map(school => <Option>{
        label: school.name,
        group: this.translateService.instant('school-and-group-typeahead.school-group'),
        value: school,
        valueType: 'School'
      }),
      ...(groups || []).map(group => <Option>{
        label: group.name,
        group: this.translateService.instant('school-and-group-typeahead.assigned-group-group'),
        value: group,
        valueType: 'Group'
      }),
      ...(userGroups || []).map(userGroup => <Option>{
        label: userGroup.name,
        group: this.translateService.instant('school-and-group-typeahead.created-group-group'),
        value: userGroup,
        valueType: 'UserGroup'
      })
    ];
  }

}
