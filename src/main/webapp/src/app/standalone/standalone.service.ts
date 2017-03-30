import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {
  groups,
  mock_group,
  mock_item,
  exams_of_group,
  mock_student,
  exams_of_student,
  iab_items,
  students
} from "./data/data";
import {AssessmentSubjectType} from "../shared/assessment-subject-type.enum";
import {AssessmentType} from "../shared/assessment-type.enum";

export function createStandaloneHttp(mockBackend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  mockBackend.connections.subscribe(connection => {

    let body: any = null;
    let requestSignature: string = `${RequestMethod[connection.request.method].toUpperCase()} ${connection.request.url}`;
    if (new RegExp(`GET /api/translations/\\w+`, 'g').test(requestSignature)) {
      connection.request.url = connection.request.url.replace('/api/translations', '/assets/i18n') + '.json';
    } else if (requestSignature == `GET /api/groups`) {
      body = groups;
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams/\\d+/report`, 'g').test(requestSignature)) {
      body = {
        exam: {
          assessment: {
            id: 1,
            subject: AssessmentSubjectType.MATH,
            type: AssessmentType.IAB,
            academicYear: 2016,
            minimumScore: 1200,
            maximumScore: 2400,
            cutPoints: [1400, 1800, 2100]
          },
          date: new Date(2014, 3, 7),
          grade: 3,
          accommodations: [0, 1, 2, 3],
          completed: true,
          valid: true,
          standardAdministration: true,
          score: 1475,
          minimumScore: 1338,
          maximumScore: 1584,
          performance: 2,
          claimPerformance: [
            {id: 0, performance: 0},
            {id: 1, performance: 1},
            {id: 2, performance: 2},
            {id: 3, performance: 1}
          ]
        },
        group: mock_group,
        student: mock_student
      };
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams/\\d+`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        student: mock_student,
        exam: exams_of_student[0],
        items: iab_items
      };
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        student: mock_student,
        exams: exams_of_student
      };
    } else if (new RegExp(`GET /api/groups/\\d+/students`, 'g').test(requestSignature)) {
      body = {
        group: mock_group,
        students: students
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
