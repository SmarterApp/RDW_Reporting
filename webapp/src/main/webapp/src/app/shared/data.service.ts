import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { CachingDataService } from "./cachingData.service";

//TODO: Break out methods from DataService so only a public generic Get.
//TODO: Other methods such as getGroups belong in their own service such as GroupService
@Injectable()
export class DataService {

  constructor(private http: Http, private staticDataService: CachingDataService) {
  }

  get(url, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .get(`/api${url}`, options)
      .map(response => response.json());
  }

  getGroups(): Observable<Array<any>> {
    return this.get(`/groups`);
  }

  getGroup(id: number): Observable<any> {
    return this.get(`/groups/${id}/students`);
  }

  getGroupExams(id: number): Observable<any> {
    return this.get(`/groups/${id}/exams`);
  }

  getGroupExamItem(groupId: number, examId: number, itemId: number) {
    return this.get(`/groups/${groupId}/exams/${examId}/items/${itemId}`);
  }

  getGroupExamItemWithScore(groupId: number, examId: number, itemId: number, score: number) {
    return this.get(`/groups/${groupId}/exams/${examId}/items/${itemId}/score/${score}`);
  }

  getItemScoring(itemId: number) {
    return this.get('/examitems/' + itemId + '/scoring');
  }

  getStudentExams(groupId: number, studentId: number): Observable<any> {
    // todo: we will have to figure out these api routes because I would think
    // we should be hitting the same controller and passing optional params.
    if (groupId)
      return this.get(`/groups/${groupId}/students/${studentId}/exams`);
    else
      return this.get(`/students/${studentId}/exams`);
  }

  getStudentExam(groupId: number, studentId: number, examId: number): Observable<any> {
    var params = new URLSearchParams();
    params.set('examId', examId.toString());
    params.set('studentId', studentId.toString());

    return this.get('/examitems', { search: params });
  }

  getStudentExamReport(groupId: number, studentId: number, examId: number): Observable<any> {
    return this.get(`/groups/${groupId}/students/${studentId}/exams/${examId}/report`);
  }

  getStudents(searchFilter: any) {
    var params = new URLSearchParams();
    params.set('ssid', searchFilter.ssid);

    return this.get('/students/search', { search: params });
  }
}
