import { AfterViewChecked, ChangeDetectorRef, Component, Input } from "@angular/core";
import { Utils } from "./support/support";

/**
 * @deprecated use <sb-button-group type="radio">
 *
 * A generic component which builds and binds a radio button list.
 * It is most typically used as:
 * (All) [ (Option 1) (Option 2) ]
 */
@Component({
  selector: 'sb-radio-button-list',
  template: `
    <div class="nested-btn-group btn-group-sm toggle-group" data-toggle="buttons">
      <label class="btn btn-primary" [ngClass]="{'active': this.model[this.property] === -1, 'disabled': disabled }">
        <input [value]="-1" [(ngModel)]="model[property]" type="radio" [name]="name"
               [attr.disabled]="disabled?'disabled':null"
               angulartics2On="click" [angularticsEvent]="analyticsEvent"
               [angularticsCategory]="analyticsCategory"
               [angularticsProperties]="{label: label + ': All'}">{{ 'common.buttons.all' | translate }}
      </label>
      <div class="btn-group">
        <label *ngFor="let value of values" class="btn btn-primary"
               [ngClass]="{'active': model[property] == value, 'disabled': disabled }">
          <input [value]="value" [(ngModel)]="model[property]" type="radio" [name]="name"
                 [attr.disabled]="disabled?'disabled':null"
                 angulartics2On="click" [angularticsEvent]="analyticsEvent"
                 [angularticsCategory]="analyticsCategory"
                 [angularticsProperties]="{label: label + ': ' + enum + '.' + value}">{{ enum + '.' + value | translate
          }}
        </label>
      </div>
    </div>`
})
export class SBRadioButtonComponent implements AfterViewChecked {

  // An array of values which must map to the given enum.
  @Input()
  public values: any[];

  // An enum defined in the translations which has a value.
  @Input()
  public enum: string;

  // The property to update and show.
  @Input()
  public property: string;

  // The model to bind to which contains the property.  (Allows us to pass by reference)
  @Input()
  public model: any;

  // When true, disables the buttons so they can not be changed
  @Input()
  public disabled: boolean = false;

  // The analytics event to send when clicked
  @Input()
  public analyticsEvent: string;

  // The analytics category to use
  @Input()
  public analyticsCategory: string;

  // The label for this button list
  @Input()
  public label: string;

  @Input()
  public selectedValue: string;


  private _name: string;

  get name(): string {
    return this._name;
  }

  constructor(private changeDetector: ChangeDetectorRef) {
    this._name = Utils.newGuid();
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }
}
