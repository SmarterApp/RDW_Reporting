import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../shared/data/data.service";

@Injectable()
export class StudentExamHistoryService {

  constructor(private dataService: DataService) {}

  /**
   * Determine if a student with the given SSID exists and has accessible exams.
   *
   * @param ssid  State-issued student identifier
   * @returns {Observable<boolean>} True if the student exists
   */
  existsById(ssid: string): Observable<boolean> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('hasExams', 'true');

    return this.dataService.get(`/students/${ssid}`, {params: params})
      .catch(() => {
        return Observable.of(false);
      })
      .map((result) => {
        return !!result;
      });
  }
}
