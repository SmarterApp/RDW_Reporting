import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Embargo } from "./embargo";
import { Toggle } from "./toggle.component";
import { EmbargoToggleEvent } from "./embargo-toggle-event";
import { EmbargoScope } from "./embargo-scope.enum";

@Component({
  selector: 'embargo-table',
  templateUrl: './embargo-table.component.html'
})
export class EmbargoTable implements OnInit {

  @Input()
  translateContext: string = '';

  @Input()
  embargoes: Embargo[] = [];

  @Input()
  overridingEmbargo: Embargo;

  @Output()
  toggle: EventEmitter<EmbargoToggleEvent> = new EventEmitter<EmbargoToggleEvent>();

  // TODO later this will be provided by a service and will be the actual subject codes: ELA, Math
  subjectCodes: string[] = [ 'ELA', 'Math' ];
  columns: Column[];

  get hasMultipleEmbargoes(): boolean {
    return this.embargoes.length > 1;
  }

  get overridingEmbargoReleasedIndividual(): boolean {
    return this.overridingEmbargo && !this.overridingEmbargo.individualEnabled
  }

  get overridingEmbargoReleasedAggregate(): boolean {
    return this.overridingEmbargo && !this.overridingEmbargo.aggregateEnabled;
  }

  ngOnInit(): void {
    this.columns = [
      new Column({id: 'name'}),
      ...this.getSubjectColumns(),
      new Column({id: 'individualEnabled'}),
      new Column({id: 'aggregateEnabled'})
    ];
  }

  toggleIndividual(toggle: Toggle, embargo: Embargo): void {
    this.toggleInternal(toggle, embargo, EmbargoScope.Individual, embargo.individualEnabled,
      this.overridingEmbargo ? this.overridingEmbargo.individualEnabled : undefined);
  }

  toggleAggregate(toggle: Toggle, embargo: Embargo): void {
    this.toggleInternal(toggle, embargo, EmbargoScope.Aggregate, embargo.aggregateEnabled,
      this.overridingEmbargo ? this.overridingEmbargo.aggregateEnabled : undefined);
  }

  private getSubjectColumns(): Column[] {
    return this.subjectCodes.map(code => {
      return new Column({
        id: 'subject',
        code: code
      });
    });
  }

  private toggleInternal(toggle: Toggle, embargo: Embargo, scope: EmbargoScope, embargoEnabled: boolean, overridingEmbargoEnabled: boolean): void {
    const value = toggle.value;

    if (value !== embargoEnabled) {

      // Fixes display by undoing visual state change to toggle when clicked.
      // It was not sufficient to prevent event propagation
      // The new state will be programmatically applied when the confirmation is issued through the toggle event listener
      toggle.value = !value;

      this.toggle.emit({
        toggle: toggle,
        embargo: embargo,
        embargoEnabled: embargoEnabled,
        scope: scope,
        value: value,
        overridingEmbargo: this.overridingEmbargo,
        overridingEmbargoEnabled: overridingEmbargoEnabled
      });
    }
  }

}

class Column {
  id: string;
  code?: string;

  constructor({
                id,
                code = ''
              }) {
    this.id = id;
    if (code) {
      this.code = code;
    }
  }
}
