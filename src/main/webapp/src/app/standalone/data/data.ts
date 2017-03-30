import {sortAscOn} from "../../shared/comparators";
import {randomId, randomSsid} from "./support/generator";
import {AssessmentType} from "../../shared/assessment-type.enum";
import {AssessmentSubjectType} from "../../shared/assessment-subject-type.enum";

/*
  item_result
    item
      results (reverse)

  assessment_result
    assessment
      results (reverse)
 */

let commonVendorId = '2B3C34BF-064C-462A-93EA-41E9E3EB8333';

export const iab_items = [
  {
    claim: 'Concepts and Procedures',
    target: 'Target F',
    score: 0,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-2703"}],"layout":"WAI"}'
    }
  },
  {
    claim: 'Problem Solving',
    target: 'Target A',
    score: 2,
    maximumScore: 2,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test123</p>","id":"I-200-22581"}]}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target F',
    score: 1,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test123</p>","bankKey":"187", "itemKey":"2708"}],"layout":"23"}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target E',
    score: 2,
    maximumScore: 2,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-1839"}],"layout":"WAI"}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target G',
    score: 1,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>alla</p>","id":"I-187-2700"}]}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target G',
    score: 0,
    maximumScore: 1,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-2704"}],"layout":"WAI"}'
    }
  },
  {
    claim: 'Concepts and Procedures',
    target: 'Target H',
    score: 2,
    maximumScore: 2,
    irisInfo: {
      vendorId: commonVendorId,
      token: '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-2705"}],"layout":"WAI"}'
    }
  }
].map((item: any, index) => {
  item.id = randomId();
  item.number = index + 1;
  return item;
});

export const assessments = [
  {
    id: 1,
    type: AssessmentType.IAB,
    name: 'Number and Operations - Fractions',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 2,
    type: AssessmentType.IAB,
    name: 'Measurement and Data',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 3,
    type: AssessmentType.IAB,
    name: 'Geometry',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 4,
    type: AssessmentType.IAB,
    name: 'Mathematics Performance Task',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  },
  {
    id: 5,
    type: AssessmentType.IAB,
    name: 'Operations and Algebraic Thinking',
    grade: 4,
    academicYear: 2016,
    subject: AssessmentSubjectType.MATH
  }
];

export const exams_of_student = [
  {
    date: new Date(2017, 1, 2),
    performance: 0,
    score: 2321,
    grade: 4,
    assessment: assessments[0]
  },
  {
    date: new Date(2017, 1, 4),
    performance: 0,
    score: 2339,
    grade: 4,
    assessment: assessments[1]
  },
  {
    date: new Date(2017, 1, 7),
    performance: 0,
    score: 2344,
    grade: 4,
    assessment: assessments[0]
  },
  {
    date: new Date(2017, 1, 15),
    performance: 0,
    score: 2378,
    grade: 4,
    assessment: assessments[2]
  },
  {
    date: new Date(2017, 1, 15),
    performance: 1,
    score: 2447,
    grade: 4,
    assessment: assessments[1]
  },
  {
    date: new Date(2017, 1, 15),
    performance: 2,
    score: 2595,
    grade: 4,
    assessment: assessments[3]
  },
  {
    date: new Date(2017, 1, 20),
    performance: 2,
    score: 2520,
    grade: 4,
    assessment: assessments[4]
  },
  {
    date: new Date(2017, 1, 20),
    performance: 2,
    score: 2520,
    grade: 4,
    assessment: assessments[4]
  }
].map((exam: any, index: number) => {
  exam.id = randomId();
  exam.items = iab_items;
  return exam;
});

export const students = [
  {firstName: "David", lastName: "Hayden"},
  {firstName: "Clementine", lastName: "Roach"},
  {firstName: "Hasad", lastName: "Valenzuela"},
  {firstName: "Joe", lastName: "Smith"},
  {firstName: "Joseph", lastName: "Cleveland"},
  {firstName: "Sara", lastName: "Blankenship"},
  {firstName: "Linus", lastName: "Todd"},
  {firstName: "Hope", lastName: "Cardinas"}
].map((student: any, index: number) => {
  student.id = index;
  student.ssid = randomSsid();
  student.exams = exams_of_student;
  return student;
});

sortAscOn(students, student => student.lastName, student => student.firstName);

export const mock_student = students[0];

export const groups = [
  {name: 'Anderson, Mary Grade 4 Math Noon', size: 27},
  {name: 'Anderson, Mary Grade 4 Math Morning', size: 13},
  {name: 'Vista Advanced Math', size: 30}
].map((group: any, index: number) => {
  return Object.assign(group, {
    id: index + 1,
    district: 'Vista Unified',
    school: 'Vista Elementary',
    subject: 'Mathematics',
    students: students
  })
});

sortAscOn(groups, group => group.name);

export const mock_group = groups[0];

export const exams_of_group = [
  {date: new Date(2017, 1, 15), assessment: assessments[0], students: {total: 6, below: .33, near: .33, above: .33, averagePerformance: 1, averageScore: 2350}},
  {date: new Date(2017, 1, 14), assessment: assessments[0], students: {total: 2, below: 0, near: .5, above: .5, averagePerformance: 2, averageScore: 2400}},
  {date: new Date(2016, 8, 12), assessment: assessments[1], students: {total: 2, below: .5, near: .5, above: 0, averagePerformance: 1, averageScore: 2344}},
  {date: new Date(2016, 7, 8), assessment: assessments[1], students: {total: 20, below: .5, near: 0, above: .5, averagePerformance: 1, averageScore: 2378}},
  {date: new Date(2016, 5, 10), assessment: assessments[2], students: {total: 20, below: .2, near: .2, above: .6, averagePerformance: 1, averageScore: 2595}},
  {date: new Date(2016, 3, 20), assessment: assessments[3], students: {total: 20, below: .1, near: .4, above: .5, averagePerformance: 1, averageScore: 2520}},
  {date: new Date(2016, 2, 2), assessment: assessments[2], students: {total: 20, below: .1, near: .4, above: .5, averagePerformance: 1, averageScore: 2520}},
  {date: new Date(2016, 1, 12), assessment: assessments[4], students: {total: 20, below: .1, near: .4, above: .5, averagePerformance: 1, averageScore: 2520}}
].map((exam:any, index: number, exams:Array<any>) => {
  exam.id = randomId();
  exam.session = 'ma-0' + (exams.length - index);
  exam.grade = 4;
  exam.attempt = 1;
  return exam;
});

export const group = Object.assign(groups[0], {
  exams: exams_of_group
});

let exams_of_session_a = [
  {performance: 0, score: 2300},
  {performance: 0, score: 2350}
].map((exam:any) => {
  exam.date = exams_of_group[0].date;
  exam.session = exams_of_group[0].session;
  exam.attempt = 1;
  return exam;
});

let exams_of_session_b = [
  {performance: 0, score: 2300},
  {performance: 0, score: 2350},
  {performance: 1, score: 2400},
  {performance: 2, score: 2450},
  {performance: 2, score: 2500}
].map((exam:any) => {
  exam.date = exams_of_group[1].date;
  exam.session = exams_of_group[1].session;
  exam.attempt = 2;
  return exam;
});

let exams_for_sessions_ab = exams_of_session_a.concat(exams_of_session_b);

export const exams_of_sessions = exams_for_sessions_ab
.map((exam:any, index:number) => {
  exam.grade = 4;
  exam.assessment = assessments[0];
  exam.student = students[index];
  return exam;
});

export const items_by_points_earned = [
  {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [2, 6]},
  {name: 'Problem Solving', target: 'Target A', studentsByScore: [4, 2, 2]},
  {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [2, 6]},
  {name: 'Communicating Reasoning', target: 'Target E', studentsByScore: [5, 3]},
  {name: 'Concepts and Procedures', target: 'Target G', studentsByScore: [2, 4, 2]},
  {name: 'Concepts and Procedures', target: 'Target G', studentsByScore: [2, 6]},
  {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [2, 6]}
].map((item: any, index:number) => {
  item.number = index + 1;
  item.id = index;
  item.exam = exams_of_group[0];
  item.percentStudentsByScore = item.studentsByScore.map((count, index, counts) => count / counts.reduce((total, count) => total + count), 0);
  return item;
});

export const mock_item:any = {
  number: 1,
  name: 'Concepts and Procedures',
  target: 'Target F',
  maximumScore: 1,
  exam: exams_of_group[0]
};

export const mock_item_results = [
  {attempt: 1},
  {attempt: 1},
  {attempt: 2},
  {attempt: 2},
  {attempt: 2},
  {attempt: 2},
  {attempt: 2}
].map((object:any, index:number) => {
  object.student = students[index];
  object.score = index < 2 ? 0 : 1;
  return Object.assign(object, mock_item);
});

mock_item.results = mock_item_results;

