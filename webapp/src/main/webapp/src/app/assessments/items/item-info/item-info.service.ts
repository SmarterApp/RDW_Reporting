import { Observable } from "rxjs";
import { UserService } from "../../../user/user.service";
import { Injectable } from "@angular/core";
import { CachingDataService } from "../../../shared/cachingData.service";
import { DataService } from "../../../shared/data/data.service";
import { URLSearchParams } from "@angular/http";

@Injectable()
export class ItemInfoService {

  constructor(private userService: UserService,
              private cachingDataService: CachingDataService,
              private dataService: DataService) {
  }

  getInterpretiveGuide(): Observable<string> {
    return this.userService
      .getCurrentUser()
      .map(user => user.configuration.interpretiveGuideUrl);
  }

  getTargetDescription(targetId): Observable<string> {
    return this.cachingDataService
      .get(`/targets/${targetId}`)
      .map(target => target.description);
  }

  getCommonCoreStandards(itemId): Observable<any[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('itemId', itemId.toString());

    return this.dataService
      .get('/commonCoreStandards', { search: params })
      .map(standards => {
        return standards.map(standard => {
          return { code: standard.code, description: standard.description }
        });
      });
  }
}
