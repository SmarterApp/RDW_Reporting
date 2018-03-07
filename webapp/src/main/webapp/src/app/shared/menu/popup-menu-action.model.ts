/**
 * This model represents a menu action.
 */
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';

export class PopupMenuAction {
  public isDisabled: (rowItem: any) => boolean = () => false;
  public tooltip: (rowItem: any) => string = () => '';
  public displayName: (rowItem: any) => string;
  public perform: (rowItem: any) => void;
  public getSubActions: (rowItem: any) => Observable<PopupMenuAction[]> = () => of([]);
}
