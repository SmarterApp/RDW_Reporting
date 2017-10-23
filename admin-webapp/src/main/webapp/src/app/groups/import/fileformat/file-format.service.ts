import { Observable } from "rxjs";
import { Response, Http } from "@angular/http";
import { TranslateService } from "@ngx-translate/core";
import { Download } from "../../../shared/data/download.model";
import { Injectable } from "@angular/core";

@Injectable()
export class FileFormatService {

  constructor(private http: Http, private translate: TranslateService) {
  }

  public getTemplateFile(): Observable<any> {
    return this.http.get('/assets/template/groups-template.csv')
      .map((response: Response) => new Download(
        this.translate.instant('labels.groups.import.file-format.template.file'),
        new Blob([ response.text() ], { type: 'text/csv; charset=utf-8' })
      ));
  }

}
