import { Component, Input } from "@angular/core";

/**
 * This component is responsible for displaying a scale score
 * with the error band.
 */
@Component({
  selector: 'scale-score',
  templateUrl: './scale-score.component.html',
})
export class ScaleScoreComponent {

  @Input()
  public score: number;

  @Input()
  public standardError?: number;

}
