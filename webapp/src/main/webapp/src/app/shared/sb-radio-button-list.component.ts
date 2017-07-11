import { Component, Input } from "@angular/core";
import { Utils } from "./Utils";

/*
  A generic component which builds and binds a radio button list.
  It is most typically used as:
  (All) [ (Option 1) (Option 2) ]
 */
@Component({
  selector: 'sb-radio-button-list',
  template: `
    <div class="nested-btn-group btn-group-sm toggle-group" data-toggle="buttons">
      <label class="btn btn-primary" [ngClass]="{'active': model[property] == -1 }">
        <input [value]="-1" [(ngModel)]="model[property]" type="radio" [name]="name" 
                angulartics2On="click" [angularticsEvent]="analyticsEvent" 
                [angularticsCategory]="analyticsCategory" [angularticsProperties]="{label: label + ': All'}">{{ 'buttons.all' | translate }}
      </label>
      <div class="btn-group">
        <label *ngFor="let value of values" class="btn btn-primary" [ngClass]="{'active': model[property] == value }">
          <input [value]="value" [(ngModel)]="model[property]" type="radio" [name]="name"
                angulartics2On="click" [angularticsEvent]="analyticsEvent" 
                [angularticsCategory]="analyticsCategory" [angularticsProperties]="{label: label + ': ' + enum + '.' + value}">{{ enum + '.' + value | translate }}
        </label>
      </div>
    </div>`
})
export class SBRadioButtonComponent {
  // An array of values which must map to the given enum.
  @Input()
  public values: number[];

  // An enum defined in the translations which has a value.
  @Input()
  public enum: string;

  // The property to update and show.
  @Input()
  public property: string;

  // The model to bind to which contains the property.  (Allows us to pass by reference)
  @Input()
  public model: any;

  // The analytics event to send when clicked
  @Input()
  public analyticsEvent: string;

  // The analytics category to use
  @Input()
  public analyticsCategory: string;

  // The label for this button list
  @Input()
  public label: string;

  private _name: string;

  get name(): string {
    return this._name;
  }

  constructor() {
    this._name = Utils.newGuid();
  }
}
