import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";
import { Download } from "../../../../shared/data/download.model";
import { map } from 'rxjs/operators';

@Injectable()
export class FileFormatService {

  constructor(private http: Http,
              private translate: TranslateService) {
  }

  public getTemplateFile(): Observable<any> {
    return this.http.get('/assets/template/groups-template.csv')
      .pipe(
        map(response => new Download(
          this.translate.instant('file-format.template-file'),
          new Blob([ response.text() ], { type: 'text/csv; charset=utf-8' })
        ))
      );
  }

}
