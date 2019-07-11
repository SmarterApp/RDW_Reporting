import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupFilterOptions } from './model/group-filter-options.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from './groups.service';
import { GroupQuery } from './model/group-query.model';
import { Group } from './model/group.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { SubjectService } from '../../subject/subject.service';
import { UserService } from '../../shared/security/service/user.service';
import { map } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../../shared/component/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';

class Column {
  id: string;
  field: string;
  sortable: boolean;

  constructor({ id, field = '', sortable = true }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
  }
}

@Component({
  selector: 'admin-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    new Column({ id: 'name' }),
    new Column({ id: 'school', field: 'schoolName' }),
    new Column({ id: 'school-year', field: 'schoolYear' }),
    new Column({ id: 'subjects', field: 'subject' }),
    new Column({ id: 'student-count', field: 'studentCount' }),
    new Column({ id: 'deleted', field: 'isDeleted', sortable: false })
  ];
  filterOptions: GroupFilterOptions;
  query: GroupQuery;
  searchTerm: string = '';
  schoolDropdownOptions: any[];
  filteredGroups: Group[];
  private _groups: Group[];
  private _modalSubscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GroupService,
    private subjectService: SubjectService,
    private modalService: BsModalService,
    private userService: UserService,
    private translateService: TranslateService,
    private notificationService: NotificationService
  ) {}

  get groups(): Group[] {
    return this._groups;
  }

  set groups(groups: Group[]) {
    this._groups = groups;
    this.updateFilteredGroups();
  }

  ngOnInit(): void {
    forkJoin(
      this.subjectService.getSubjectCodes(),
      this.service.getFilterOptions()
    ).subscribe(([subjectCodes, filterOptions]) => {
      this.filterOptions = filterOptions;
      this.filterOptions.subjects = [undefined, ...subjectCodes];

      this.query = new GroupQuery(this.filterOptions.subjects);

      if (this.filterOptions.schools.length == 0) {
        return;
      }

      this.schoolDropdownOptions = this.filterOptions.schools.map(
        school =>
          <any>{
            label: `${school.name} (${school.naturalId})`,
            value: school,
            name: school.name,
            naturalId: school.naturalId
          }
      );

      this.route.params.subscribe((params: any) => {
        this.query.school =
          this.filterOptions.schools.find(
            school => school.id == params.schoolId
          ) || this.filterOptions.schools[0];
        this.query.schoolYear =
          this.filterOptions.schoolYears.find(
            year => year === +params.schoolYear
          ) || this.filterOptions.schoolYears[0];
        this.query.subject =
          this.filterOptions.subjects.find(
            subject => subject === params.subject
          ) || this.filterOptions.subjects[0];
        this.updateResults();
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe(): void {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }

  updateRoute(): void {
    const params = {
      schoolId: this.query.school.id,
      schoolYear: this.query.schoolYear,
      subject: this.query.subject
    };

    if (params.subject == null) {
      delete params.subject;
    }

    this.router.navigate(['/admin-groups', params]);
  }

  onSearchChange() {
    this.updateFilteredGroups();
  }

  updateResults() {
    this.service.getGroups(this.query).subscribe(groups => {
      this.groups = groups;
    });
  }

  updateFilteredGroups() {
    this.filteredGroups = this.groups.filter(
      x => x.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0
    );
  }

  openDeleteGroupModal(group: Group): void {
    this.userService
      .getUser()
      .pipe(map(user => user.sessionRefreshUrl.includes('sandbox')))
      .subscribe(sandboxUser => {
        const { translateService, modalService } = this;
        const modalReference: BsModalRef = modalService.show(
          ConfirmationModalComponent
        );
        const modal: ConfirmationModalComponent = modalReference.content;
        modal.head = translateService.instant(
          'delete-group-modal.title',
          group
        );
        modal.acceptButton = translateService.instant('common.action.delete');
        modal.declineButton = translateService.instant('common.action.cancel');
        if (sandboxUser) {
          modal.body = translateService.instant(
            'delete-group-modal.sandbox-body'
          );
          modal.acceptButtonClass = 'hidden';
        } else {
          modal.body = translateService.instant(
            'delete-group-modal.content-html'
          );
          modal.acceptButtonClass = 'btn-danger';
          modal.accept.subscribe(() => {
            this.service.delete(group).subscribe(
              () => {
                this.groups = this.groups.filter(({ id }) => id != group.id);
              },
              () => {
                this.notificationService.error({
                  id: 'delete-group-modal.error'
                });
              }
            );
          });
        }
      });
  }
}
