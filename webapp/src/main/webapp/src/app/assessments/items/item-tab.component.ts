import { Component, OnInit, Input } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";

@Component({
  selector: 'item-tab',
  templateUrl: './item-tab.component.html'
})
export class ItemTabComponent {
  /**
   * The assessment item to show in this tab.
   */
  @Input()
  item: AssessmentItem;

  /**
   * Should show item details such as the Item Viewer, Exemplar, and Item Info.
   * Typically this should be false if the assessment type is Summative.
   */
  @Input()
  showItemDetails: boolean;

  @Input()
  response: any;

  @Input()
  set position(value: number) {
    this._position = value;
  }

  get position(): number {
    if (this._position > 0) return this._position;
    return (this.item.position > 0) ? this.item.position : -1;
  }

  /**
   * If set to true, item-viewer (and iris) will be loaded and added to the dom.
   */
  loadItemViewer: boolean = false;

  /**
   * If set to true, item-exemplar will be loaded and added to the dom.
   */
  loadExemplar: boolean = false;

  get translateRoot(){
    return 'labels.assessments.items.tabs.';
  }

  private _position: number = -1;

  constructor() { }

}
