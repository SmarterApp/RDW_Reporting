import { Component, Input, OnInit } from '@angular/core';
import { ItemScoringService } from "./item-scoring.service";
import { ItemScoringGuide } from "./model/item-scoring-guide.model";
import { Utils } from "../../../shared/support/support";

@Component({
  selector: 'item-exemplar',
  templateUrl: './item-exemplar.component.html'
})
export class ItemExemplarComponent implements OnInit {

  /**
   * The bank item key of an item.
   */
  @Input()
  public bankItemKey: string;
  public model: ItemScoringGuide;
  public notFound: boolean = false;
  public errorLoading: boolean = false;
  public loading: boolean = true;

  constructor(private service: ItemScoringService) {
  }

  public get translateRoot() {
    return 'labels.assessments.items.tabs.exemplar.';
  }

  ngOnInit() {
    this.service.getGuide(this.bankItemKey)
      .subscribe(guide => {
          this.model = guide;
          this.loading = false;

          // TODO re-look at this logic
          this.notFound = guide.rubrics.length === 0
            && guide.exemplars.length === 0
            && Utils.isNullOrUndefined(guide.answerKeyValue);
        },
        (response) => {

          // TODO fix this?
          if (response.status = 404)
            this.notFound = true;
          else
            this.errorLoading = true;

          this.loading = false;
        });
  }
}
