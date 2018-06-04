import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { copy, equals, UserGroup } from './user-group';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserGroupOptionsService } from './user-group-options.service';
import { UserGroupFormOptions } from './user-group-form-options';
import { NotificationService } from '../shared/notification/notification.service';
import { Subscription } from 'rxjs/Subscription';
import { StudentSearchFormOptionsService } from '../student/search/student-search-form-options.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Student } from '../student/search/student';
import { StudentSearchForm } from '../student/search/student-search-form';
import { StudentSearch, StudentService } from '../student/search/student.service';
import { byString, join } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { UserGroupFormComponent } from './user-group-form.component';
import {
  countFilters,
  createStudentArrayFilter,
  StudentArrayFilter,
  StudentFilter
} from '../shared/filter/student-filter';
import { StudentFilterOptions } from '../shared/filter/student-filter-options';
import { FilterOptionsService } from '../shared/filter/filter-options.service';
import { ApplicationSettingsService } from '../app-settings.service';
import { ApplicationSettings } from '../app-settings';
import { Forms } from '../shared/form/forms';
import { SchoolAndGroupTypeaheadOptionMapper } from '../student/search/school-and-group-typeahead-option.mapper';
import { Option as SchoolAndGroupTypeaheadOption } from '../student/search/school-and-group-typeahead.component';
import { Option } from '../shared/form/option';

const StudentComparator = join(
  ordering(byString).on<Student>(student => student.lastName).compare,
  ordering(byString).on<Student>(student => student.firstName).compare
);

@Component({
  selector: 'user-group',
  templateUrl: './user-group.component.html'
})
export class UserGroupComponent implements OnInit, OnDestroy {

  // group form
  formOptions: UserGroupFormOptions;
  originalGroup: UserGroup;
  group: UserGroup;

  // student form
  schoolAndGroupTypeaheadOptions: SchoolAndGroupTypeaheadOption[];
  studentForm: StudentSearchForm;
  studentFilterOptions: StudentFilterOptions;
  studentArrayFilter: StudentArrayFilter;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  applicationSettings: ApplicationSettings;
  showAdvancedFilters: boolean = false;
  loadingStudents: boolean = true;
  advancedFilterCount: number = 0;

  processingSubscription: Subscription;
  initialized: boolean;

  private _saveButtonDisabled: boolean = true;

  @ViewChild('groupForm')
  groupForm: UserGroupFormComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private optionService: UserGroupOptionsService,
              private service: UserGroupService,
              private studentFormOptionService: StudentSearchFormOptionsService,
              private schoolAndGroupTypeaheadOptionMapper: SchoolAndGroupTypeaheadOptionMapper,
              private filterOptionService: FilterOptionsService,
              private studentService: StudentService,
              private applicationSettingsService: ApplicationSettingsService,
              private translate: TranslateService,
              private notificationService: NotificationService) {
    this.originalGroup = this.route.snapshot.data[ 'group' ];
  }

  get saveButtonDisabled(): boolean {
    return this.processingSubscription != null || this._saveButtonDisabled;
  }

  get deleteButtonDisabled(): boolean {
    return this.processingSubscription != null;
  }

  ngOnInit(): void {
    forkJoin(
      this.applicationSettingsService.getSettings(),
      this.optionService.getOptions(),
      this.studentFormOptionService.getOptions(),
      this.filterOptionService.getFilterOptions()
    ).subscribe(([ applicationSettings, options, studentFormOptions, filterOptions ]) => {

      this.applicationSettings = applicationSettings;

      // setup group form
      this.formOptions = <UserGroupFormOptions>{
        subjects: options.subjects.map(code => <Option>{
          value: code,
          text: this.translate.instant('common.subject.' + code + '.name'),
          analyticsProperties: {
            label: `Subject: ${code}`
          }
        })
      };

      if (this.originalGroup == null) {
        this.group = <UserGroup>{
          name: '',
          subjects: options.subjects.concat(),
          students: []
        };
      } else {
        if (this.originalGroup.subjects == null) {
          this.originalGroup.subjects = options.subjects.concat();
        }
        this.group = copy(this.originalGroup);
      }

      // setup student form
      this.schoolAndGroupTypeaheadOptions = this.schoolAndGroupTypeaheadOptionMapper
        .createOptions({
            schools: studentFormOptions.schools,
            groups: this.originalGroup == null
              ? studentFormOptions.groups
              : studentFormOptions.groups
                .filter(group => !(group.userCreated && group.id === this.originalGroup.id))
          });

      this.studentForm = {
        schoolOrGroup: this.schoolAndGroupTypeaheadOptions[0],
        nameOrSsid: ''
      };

      this.studentFilterOptions = filterOptions;

      this.initialized = true;

      this.searchStudents();
    });
  }

  ngOnDestroy(): void {
    if (this.processingSubscription != null) {
      this.unsubscribe();
    }
  }

  onCancelButtonClick(): void {
    this.navigateHome();
  }

  onSaveButtonClick(): void {
    Forms.submit(
      this.groupForm.formGroup,
      () => {
        this.processingSubscription = this.service.saveGroup(this.group)
          .subscribe(() => {
              this.navigateHome();
            },
            () => {
              this.notificationService.error({ id: 'user-group.save-error' });
            }, () => {
              this.unsubscribe();
            });
      }
    );
  }

  onDeleteButtonClick(): void {
    this.processingSubscription = this.service.deleteGroup(this.group)
      .subscribe(() => {
          this.navigateHome();
        },
        () => {
          this.notificationService.error({ id: 'user-group.delete-error' });
        }, () => {
          this.unsubscribe();
        });
  }

  onStudentFormSearchChange(): void {
    this.searchStudents();
  }

  onStudentFormFilterChange(): void {
    this.updateFormStudents();
  }

  onGroupNameChange(): void {
    setTimeout(() => {
      this.updateSaveButtonDisabled();
    }, 0);
  }

  onGroupSubjectsChange(): void {
    this.updateSaveButtonDisabled();
  }

  onGroupStudentsChange(students: Student[]): void {
    this.updateFormStudents();
    this.updateSaveButtonDisabled();
  }

  onFormStudentClick(student: Student): void {
    this.addStudents(student);
  }

  addAllStudentsButtonClick() {
    this.addStudents(...this.filteredStudents);
  }

  private addStudents(...students: Student[]) {
    this.group.students = this.group.students
      .concat(students)
      .sort(StudentComparator);

    // Hacky fix to allow angular forms to process validity checks before we update based on that validity
    setTimeout(() => {
      this.updateFormStudents();
      this.updateSaveButtonDisabled();
    }, 0);
  }

  onShowAdvancedFiltersChange(value: boolean): void {
    this.showAdvancedFilters = value;
  }

  onAdvancedFilterChange(filter: StudentFilter): void {
    this.studentArrayFilter = createStudentArrayFilter(filter);
    this.advancedFilterCount = countFilters(filter);
    this.updateFormStudents();
  }

  private navigateHome(): void {
    this.router.navigate([ '' ]);
  }

  private unsubscribe(): void {
    this.processingSubscription.unsubscribe();
    this.processingSubscription = null;
  }

  private searchStudents(): void {
    const search = this.createStudentSearch(this.studentForm);
    if (Object.keys(search).length) {
      this.loadingStudents = true;
      this.studentService.getStudents(search)
        .subscribe(students => {
            this.loadingStudents = false;
            this.students = students.sort(StudentComparator);
            this.updateFormStudents();
          },
          () => {
            this.loadingStudents = false;
            this.students = [];
          });
    } else {
      this.students = [];
      this.updateFormStudents();
    }
  }

  private createStudentSearch(searchForm: StudentSearchForm): StudentSearch {
    const search = <StudentSearch>{};
    if (searchForm.schoolOrGroup != null) {
      if (searchForm.schoolOrGroup.valueType === 'School') {
        search.schoolId = searchForm.schoolOrGroup.value.id;
      } else if (searchForm.schoolOrGroup.valueType === 'Group') {
        search.groupId = searchForm.schoolOrGroup.value.id;
      } else if (searchForm.schoolOrGroup.valueType === 'UserGroup') {
        search.userGroupId = searchForm.schoolOrGroup.value.id;
      }
    }
    if (searchForm.nameOrSsid != null) {
      search.nameOrSsid = searchForm.nameOrSsid;
    }
    return search;
  }

  private updateFormStudents(): void {
    const nameSearch = (this.studentForm.nameOrSsid || '')
      .toLowerCase()
      .replace(/[,]/g, '')
      .replace(/\s+/g, '');

    this.filteredStudents = this.students
      .filter((student, index, students) => {
        return this.group.students.find(x => x.id === student.id) == null
          && (
            student.ssid.startsWith(this.studentForm.nameOrSsid)
            || `${(student.lastName.trim() + student.firstName.trim()).toLowerCase()}`.startsWith(nameSearch)
            || `${(student.firstName.trim() + student.lastName.trim()).toLowerCase()}`.startsWith(nameSearch)
          ) && (
            this.studentArrayFilter == null
            || this.studentArrayFilter(student, index, students)
          );
      })
      .sort(StudentComparator);
  }

  private updateSaveButtonDisabled(): void {
    this._saveButtonDisabled = !this.initialized
      || equals(this.originalGroup, this.group);
  }

}

