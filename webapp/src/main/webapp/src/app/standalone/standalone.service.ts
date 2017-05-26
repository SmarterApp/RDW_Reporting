import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {
  groups, mock_group, mock_item, exams_of_group, mock_student, exams_of_student, iab_items, students,
  mock_rubrics, mock_schoolyears, assessments, DEPRECATED_exams_of_student, user, groupAssessments
} from "./data/data";

export function createStandaloneHttp(mockBackend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  mockBackend.connections.subscribe(connection => {

    let body: any = null;
    let requestSignature: string = `${RequestMethod[connection.request.method].toUpperCase()} ${connection.request.url}`;

    if (new RegExp(`GET /api/translations/\\w+`, 'g').test(requestSignature)) {
      connection.request.url = connection.request.url.replace('/api/translations', '/assets/i18n') + '.json';
    } else if (requestSignature == `GET /api/groups`) {
      body = groups;
    } else if (requestSignature == `GET /api/user`) {
      body = user;
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams/\\d+/report`, 'g').test(requestSignature)) {
      body = {
        //report
      };
    } else if (new RegExp(`GET /api/examitems\\?examId=\\d+&studentId=\\d+`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        student: mock_student,
        exam: DEPRECATED_exams_of_student[0],
        items: iab_items
      };
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        student: mock_student,
        exams: DEPRECATED_exams_of_student
      };
    } else if (new RegExp(`GET /api/students/\\d+/exams`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        student: mock_student,
        exams: DEPRECATED_exams_of_student
      };
    } else if (new RegExp(`GET /api/groups/\\d+/students`, 'g').test(requestSignature)) {
      body = {
        students: students,
        group: mock_group
      };
    } else if (new RegExp(`GET /api/groups/\\d+/exams/\\d+/items/\\d+/score/\\d+`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        item: mock_item
      };
    } else if (new RegExp(`GET /api/groups/\\d+/exams/\\d+/items/\\d+`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        item: mock_item
      };
    } else if (new RegExp(`GET /api/groups/\\d+/exams`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        assessment_results: exams_of_group
      };
    } else if (new RegExp('GET /api/examitems/\\d+/scoring', 'g').test(requestSignature)) {
      var itemId = Number.parseInt(requestSignature.replace('GET /api/examitems/', '').replace('/scoring', ''));
      let result :any = mock_rubrics.find(x => x.itemId == itemId);
      body = result.examItemSolution;

    } else if(new RegExp(`GET /api/schoolYears`, 'g').test(requestSignature)) {
      body = mock_schoolyears;

    } else if(new RegExp(`GET /api/groups/\\d+/latestassessment`, 'g').test(requestSignature)) {

      let startIndex = requestSignature.indexOf("schoolYear=");
      let schoolYear = Number.parseInt(requestSignature.substring(startIndex).replace("schoolYear=", ""));
      body = groupAssessments.find(x=> x.assessment.academicYear == schoolYear);

    } else if (requestSignature.startsWith(`GET /api/students/search?ssid=`)) {
      let query  = requestSignature.replace(`GET /api/students/search?ssid=`, '').toLowerCase();
      let studentsResult = students.filter(x =>
          x.ssid.toString().startsWith(query)
          || x.firstName.toLowerCase().startsWith(query)
          || x.lastName.toLowerCase().startsWith(query)
      );

      body = {
        group: mock_group,
        students: studentsResult
      };
    }

    if (body != null) {
      console.debug(`[StandaloneService] serving mock for "${requestSignature}":`, body);
      connection.mockRespond(new Response(new ResponseOptions({body: body})));
    } else {
      console.debug(`[StandaloneService] no mock for "${requestSignature}"`);
      let realHttp = new Http(realBackend, options);
      realHttp.request(connection.request).subscribe(response => connection.mockRespond(response));
    }

  });

  return new Http(mockBackend, options);
}

export const standaloneProviders = [
  MockBackend,
  BaseRequestOptions,
  {
    provide: Http,
    deps: [MockBackend, BaseRequestOptions, XHRBackend],
    useFactory: createStandaloneHttp
  }
];
