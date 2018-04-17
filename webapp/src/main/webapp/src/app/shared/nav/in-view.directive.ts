import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { WindowRefService } from '../core/window-ref.service';
import { Utils } from '../support/support';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[inView]'
})
export class InViewDirective implements OnDestroy {

  @Output()
  inView: EventEmitter<InViewDirective> = new EventEmitter();

  private _window: Window;
  private _valid: boolean = false;
  private _invalidatorSubscription: Subscription;

  constructor(private elementReference: ElementRef,
              windowReferenceService: WindowRefService) {
    this._window = windowReferenceService.nativeWindow;
  }

  ngOnDestroy(): void {
    if (this._invalidatorSubscription != null) {
      this._invalidatorSubscription.unsubscribe();
    }
  }

  @Input('inViewInvalidator')
  set invalidator(observable: Observable<void>) {
    if (observable == null) {
      throw new Error(`invalidator must not be null or undefined`);
    }
    this._invalidatorSubscription = observable.subscribe(() => {
      this.valid = false;
    });
  }

  get valid(): boolean {
    return this._valid;
  }

  set valid(value: boolean) {
    if (this._valid !== value) {
      this._valid = value;
      this.dispatchEventIfInvalidAndInView();
    }
  }

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onWindowScrollOrResize(): void {
    this.dispatchEventIfInvalidAndInView();
  }

  private dispatchEventIfInvalidAndInView(): void {
    if (!this._valid && Utils.inView(this.elementReference.nativeElement, this._window)) {
      this.inView.emit(this);
      this._valid = true;
    }
  }

}
