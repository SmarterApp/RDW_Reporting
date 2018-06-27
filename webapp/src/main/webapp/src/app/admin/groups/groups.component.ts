import { Component, OnDestroy, OnInit } from "@angular/core";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupService } from "./groups.service";
import { GroupQuery } from "./model/group-query.model";
import { Group } from "./model/group.model";
import { DeleteGroupModalComponent } from "./delete-group.modal";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subscription } from "rxjs/Subscription";
import { SubjectService } from '../../subject/subject.service';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Component({
  selector: 'admin-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit, OnDestroy {

  columns: Column[] = [
    new Column({id: 'name'}),
    new Column({id: 'school', field: 'schoolName'}),
    new Column({id: 'school-year', field: 'schoolYear'}),
    new Column({id: 'subjects', field: 'subject'}),
    new Column({id: 'student-count', field: 'studentCount'}),
    new Column({id: 'deleted', field: 'isDeleted', sortable: false})
  ];
  filterOptions: GroupFilterOptions;
  query: GroupQuery;
  searchTerm: string = '';
  schoolDropdownOptions: any[];
  filteredGroups: Group[];
  private _groups: Group[];
  private _modalSubscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: GroupService,
              private subjectService: SubjectService,
              private modalService: BsModalService) {
  }

  get groups(): Group[] {
    return this._groups;
  }

  set groups(groups: Group[]) {
    this._groups = groups;
    this.updateFilteredGroups();
  }

  ngOnInit() {
    forkJoin(
      this.subjectService.getSubjectCodes(),
      this.service.getFilterOptions()
    )
    .subscribe(([subjectCodes, filterOptions]) => {

      this.filterOptions = filterOptions;
      this.filterOptions.subjects = [undefined, ...subjectCodes];

      this.query = new GroupQuery(this.filterOptions.subjects);

      if (this.filterOptions.schools.length == 0) {
        return;
      }

      this.schoolDropdownOptions = this.filterOptions.schools.map(school => <any>{
        label: `${school.name} (${school.naturalId})`,
        value: school,
        name: school.name,
        naturalId: school.naturalId
      });

      this.route.params.subscribe((params: any) => {
        this.query.school = this.filterOptions.schools.find(school => school.id == params.schoolId) || this.filterOptions.schools[ 0 ];
        this.query.schoolYear = this.filterOptions.schoolYears.find(year => year === +params.schoolYear) || this.filterOptions.schoolYears[ 0 ];
        this.query.subject = this.filterOptions.subjects.find(subject => subject === params.subject) || this.filterOptions.subjects[ 0 ];
        this.updateResults();
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    this._modalSubscriptions.forEach(subscription => subscription.unsubscribe());
    this._modalSubscriptions = [];
  }

  updateRoute() {
    let params = {
      schoolId: this.query.school.id,
      schoolYear: this.query.schoolYear,
      subject: this.query.subject
    };

    if (params.subject == null) {
      delete params.subject;
    }

    this.router.navigate([ '/admin-groups', params ]);
  }

  onSearchChange() {
    this.updateFilteredGroups();
  }

  updateResults() {
    this.service
      .getGroups(this.query)
      .subscribe(groups => {
        this.groups = groups;
      });
  }

  updateFilteredGroups() {
    this.filteredGroups = this.groups
      .filter(x => x.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0);
  }

  openDeleteGroupModal(group: Group) {
    let modalReference: BsModalRef = this.modalService.show(DeleteGroupModalComponent);
    let modal: DeleteGroupModalComponent = modalReference.content;
    modal.group = group;
    this._modalSubscriptions.push(modal.deleted.subscribe(group => {
      this.groups = this.groups.filter(g => g.id != group.id);
    }));
    this._modalSubscriptions.push(this.modalService.onHidden.subscribe(() => {
      this.unsubscribe();
    }));
  }

}

class Column {
  id: string;
  field: string;
  sortable: boolean;

  constructor({
                id,
                field = '',
                sortable = true
  }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
  }
}
