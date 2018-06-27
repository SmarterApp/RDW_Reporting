import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { ApplicationSettingsService } from '../../../app-settings.service';

@Injectable()
export class ItemInfoService {

  constructor(private applicationSettingsService: ApplicationSettingsService) {
  }

  getInterpretiveGuide(): Observable<string> {
    return this.applicationSettingsService.getSettings().pipe(
      map(settings => settings.interpretiveGuideUrl)
    );
  }

}
