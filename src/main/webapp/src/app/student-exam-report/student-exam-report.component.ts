import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-student-exam-report',
  templateUrl: './student-exam-report.component.html'
})
export class StudentExamReportComponent implements OnInit {

  private report;

  constructor(private service: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: any) => {
        this.service.getStudentExamReport(params.groupId, params.studentId, params.examId)
          .subscribe((report: any) => {
            let end = report.exam.assessment.maximumScore;
            let start = report.exam.assessment.minimumScore;
            let score = report.exam.score;
            let length = end - start;
            this.report = Object.assign({}, report, {
              confidence: {
                start: start,
                end: end,
                length: length,
                score: score,
                scorePosition: ((score - start) / length) * 100,
                minimumScorePosition: Math.floor(((report.exam.minimumScore - start) / length) * 100),
                maximumScorePosition: Math.ceil(((report.exam.maximumScore - start) / length) * 100),
                categories: report.exam.assessment.cutPoints
                  .concat([report.exam.assessment.maximumScore])
                  .map((point, index, points) => {
                    let offset = index == 0 ? 0 : ((points[index - 1] - start) / length);
                    return {
                      point: point,
                      width: (((point - start) / length) - offset) * 100
                    };
                  })
              }
            });
          })
      })
  }

}
