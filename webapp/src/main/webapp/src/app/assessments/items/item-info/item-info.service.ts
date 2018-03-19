import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { CachingDataService } from "../../../shared/data/caching-data.service";
import { DataService } from "../../../shared/data/data.service";
import { map } from 'rxjs/operators';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { ReportingServiceRoute } from '../../../shared/service-route';

@Injectable()
export class ItemInfoService {

  constructor(private applicationSettingsService: ApplicationSettingsService,
              private cachingDataService: CachingDataService,
              private dataService: DataService) {
  }

  getInterpretiveGuide(): Observable<string> {
    return this.applicationSettingsService.getSettings().pipe(
      map(settings => settings.interpretiveGuideUrl)
    );
  }

  getTargetDescription(targetId): Observable<string> {
    return this.cachingDataService.get(`${ReportingServiceRoute}/targets/${targetId}`).pipe(
      map(target => target.description)
    );
  }

  // TODO should return typed interface/class
  getCommonCoreStandards(itemId): Observable<any[]> {
    return this.dataService.get(`${ReportingServiceRoute}/commonCoreStandards`, {
      search: {
        itemId: itemId.toString()
      }
    }).pipe(
      map(serverStandards => serverStandards.map(serverStandard => <any>{
        code: serverStandard.code,
        description: serverStandard.description
      }))
    );
  }

}
