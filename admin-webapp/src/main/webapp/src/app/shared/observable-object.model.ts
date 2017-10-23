import { Observable, Observer } from "rxjs";

export class ObservableObject {
  get onChanges(): Observable<any> {
    return this._onChanges;
  }

  private _onChanges : Observable<any>;
  private onChangesObserver : Observer<string>;
  private oldObject : any = {};

  constructor() {
    this._onChanges = new Observable<any>(observer => this.onChangesObserver = observer).share();
    Object.assign(this.oldObject, this);
  }

  protected notifyChange(property){
    // If a tree falls in a forest with no one around,
    // does it make a sound?  In this case, we won't.
    if(!this.onChangesObserver)
      return;

    if(this[property] !== this.oldObject[property]){
      this.onChangesObserver.next(property);
      this.oldObject[property] = this[property];
    }
  }
}
