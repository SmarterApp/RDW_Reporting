import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { TabsetComponent, TabDirective } from "ngx-bootstrap";

@Component({
  selector: 'item-tab',
  templateUrl: './item-tab.component.html'
})
export class ItemTabComponent implements OnInit {

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
  showStudentScores: boolean = true;

  @Input()
  set position(value: number) {
    this._position = value;
  }

  get position(): number {
    if (this._position > 0) return this._position;
    return (this.item.position > 0) ? this.item.position : -1;
  }

  @ViewChild('itemTabs')
  itemTabs: TabsetComponent;

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

  ngOnInit(): void {

    //Unfortunate hack to "select" the initial tab
    //The timeout is required to give the TabComponent time to process
    //its template-defined TabDirectives.
    setTimeout((function() {
      let tab: TabDirective = this.itemTabs.tabs[0];
      tab.select.emit(tab);
    }).bind(this), 0);
  }

}
