import { Component, OnInit, OnDestroy } from "@angular/core";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupService } from "./groups.service";
import { GroupQuery } from "./model/group-query.model";
import { Group } from "./model/group.model";
import { DeleteGroupModalComponent } from "./delete-group.modal";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Subscription } from "rxjs";

@Component({
  selector: 'groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit, OnDestroy {

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
    this.filterOptions = this.route.snapshot.data[ 'filterOptions' ];
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
    this.router.navigate([ 'groups', params ]);
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
