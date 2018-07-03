import { Component, OnInit } from '@angular/core';
import { ApplicationSettingsService } from '../../app-settings.service';

@Component({
  selector: 'access-denied',
  templateUrl: './access-denied.component.html'
})
export class AccessDeniedComponent implements OnInit {
  loading: boolean = true;

  constructor(private service: ApplicationSettingsService) { }

  ngOnInit() {
    this.loading = true;
    this.service.getSettings().subscribe(settings => {
      if (settings.accessDeniedUrl != null) {
        window.location.href = settings.accessDeniedUrl;
      }
      else {
        this.loading = false;
      }
    });
  }

}
