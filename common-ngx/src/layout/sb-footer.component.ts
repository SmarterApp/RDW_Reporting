import { Component } from "@angular/core";

@Component({
  selector: 'sb-footer',
  template: `
    <footer class="mt-md mb-md">
      <div class="container">
        <p class="text-right black">{{'common-ngx.footer' | translate}}</p>
      </div>
    </footer>
  `
})
export class SbFooter {
}
