import { Component } from "@angular/core";
import { ApplicationSettings } from '../app-settings';
import { ApplicationSettingsService } from '../app-settings.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  host: {
    'class': 'home-view'
  }
})
export class HomeComponent {

  applicationSettings: ApplicationSettings;

  constructor(private applicationSettingsService: ApplicationSettingsService) {
  }

  ngOnInit(): void {
    this.applicationSettingsService.getSettings().subscribe(settings => {
      this.applicationSettings = settings;
    });
  }

}
