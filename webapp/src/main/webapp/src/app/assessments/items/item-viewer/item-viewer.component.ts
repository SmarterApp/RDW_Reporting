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

  public irisIsLoading: boolean = true;
  public safeIrisUrl: SafeResourceUrl;
  private vendorId;

  private _irisFrame;

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
      // let irisUrl = "http://ec2-52-33-16-206.us-west-2.compute.amazonaws.com/";

      this.safeIrisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(irisUrl);
      this.vendorId = user.configuration.irisVendorId;
      this._irisFrame.addEventListener('load', this.irisframeOnLoad.bind(this));
    })
  }

  irisframeOnLoad() {
    IRiS.setFrame(this._irisFrame);

    let token = this.getToken(this.bankItemKey);
    IRiS.loadToken(this.vendorId, token);
    this.irisIsLoading = false;
  }

  private getToken(bankItemKey){
    return `{"passage":{"autoLoad":"false"},"items":[{"id":"I-${bankItemKey}"}],"layout":"WAI"}`;

    // return `{"items":[{"id":"I-${bankItemKey}"}], "accommodations": []}`;
    // return `{"items":[{"response":"","id":"I-187-1437"}],"accommodations":[]}`
  }
}
