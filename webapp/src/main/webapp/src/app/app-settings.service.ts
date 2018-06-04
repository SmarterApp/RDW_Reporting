import { ApplicationSettings } from './app-settings';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CachingDataService } from './shared/data/caching-data.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const EmptySettings = of(<any>{});

@Injectable()
export class ApplicationSettingsService {

  constructor(private dataService: CachingDataService) {
  }

  getSettings(): Observable<ApplicationSettings> {
    return this.dataService.get('/settings').pipe(
      map(serverSettings => <ApplicationSettings>{
        analyticsTrackingId: serverSettings.analyticsTrackingId,
        elasEnabled: serverSettings.englishLanguageAcquisitionStatusEnabled,
        interpretiveGuideUrl: serverSettings.interpretiveGuideUrl,
        irisVendorId: serverSettings.irisVendorId,
        lepEnabled: serverSettings.limitedEnglishProficienciesEnabled,
        minItemDataYear: serverSettings.minItemDataYear,
        percentileDisplayEnabled: serverSettings.percentileDisplayEnabled,
        reportLanguages: serverSettings.reportLanguages,
        state: {
          code: serverSettings.state.code,
          name: serverSettings.state.name
        },
        targetReport: {
          insufficientDataCutoff: serverSettings.targetReport.insufficientDataCutoff,
          minNumberOfStudents: serverSettings.targetReport.minNumberOfStudents
        },
        transferAccess: serverSettings.transferAccessEnabled,
        uiLanguages: serverSettings.uiLanguages,
        userGuideUrl: serverSettings.userGuideUrl
      }),
      catchError(error => EmptySettings)
    );
  }

}
