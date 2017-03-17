import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class DataService {

  constructor(private http: Http) {}

  private get(url): Observable<any> {
    return this.http
      .get(`/api${url}`)
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

  getStudentExams(groupId: number, studentId: number): Observable<any> {
    return this.get(`/groups/${groupId}/students/${studentId}/exams`);
  }

  getStudentExam(groupId: number, studentId: number, examId: number): Observable<any> {
    return this.get(`/groups/${groupId}/students/${studentId}/exams/${examId}`);
  }

  getExam(id: number): Observable<any> {
    return this.get(`/exams/${id}`);
  }

}
