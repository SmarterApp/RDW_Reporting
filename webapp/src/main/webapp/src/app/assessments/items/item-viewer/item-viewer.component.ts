import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { UserService } from "../../../user/user.service";

/**
 * IRiS is the vendor client which allows us to integrate with the
 * Iris iframe.  Declarations are in javasvcript files located in the
 * scripts/iris/client.js
 */
declare var IRiS: any;

/**
 * This component renders the IRIS iframe for viewing the original exam item
 * and student's response.
 */
@Component({
  selector: 'item-viewer',
  templateUrl: './item-viewer.component.html'
})
export class ItemViewerComponent implements OnInit {
  /**
   * The bank item key resolvable in Iris.
   */
  @Input()
  public bankItemKey: string;

  @Input()
  public response: string = '';

  public irisIsLoading: boolean = true;
  public safeIrisUrl: SafeResourceUrl;
  private vendorId;

  private _irisFrame;
  private _currentAttempt = 3;

  @ViewChild('irisframe')
  set irisFrame(value: ElementRef) {
    if (value && value.nativeElement) {
      this._irisFrame = value.nativeElement;
    }
  }

  constructor(private sanitizer: DomSanitizer, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      let irisUrl = user.configuration.irisUrl;

      this.safeIrisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(irisUrl);
      this.vendorId = user.configuration.irisVendorId;

      this._irisFrame.addEventListener('load', this.irisframeOnLoad.bind(this));
    });
  }

  irisframeOnLoad() {
    IRiS.setFrame(this._irisFrame);
    this.irisIsLoading = false;

    // This will fire after iris finishes running it's setup js.
    setTimeout(this.loadToken.bind(this), 0);
  }

  loadToken() {
    let token = this.getToken(this.bankItemKey);
    IRiS.loadToken(this.vendorId, token)
      .fail((function(err) {
        if (this._currentAttempt-- > 0) {
          console.log("Failed to load token, attempting again", err);
          setTimeout(this.loadToken.bind(this), 2000);
        } else {
          console.log("Max failures attempted, aborting.");
        }
      }).bind(this));
  }

  private getToken(bankItemKey){
    return `{"items":[{"response":"","id":"I-${bankItemKey}"}], "accommodations": []}`;
  }
}
