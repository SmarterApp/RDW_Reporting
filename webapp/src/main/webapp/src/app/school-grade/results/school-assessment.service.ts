import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { DataService } from "@sbac/rdw-reporting-common-ngx";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentProvider } from "../../assessments/assessment-provider.interface";
import { isNullOrUndefined } from "util";
import { ResponseUtils } from "../../shared/response-utils";
import { ExportRequest } from "../../assessments/model/export-request.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { Grade } from "../grade.model";
import { TranslateService } from "@ngx-translate/core";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { Angulartics2 } from "angulartics2";

@Injectable()
export class SchoolAssessmentService implements AssessmentProvider {

  schoolId: number;
  schoolName: string;
  grade: Grade;
  schoolYear: number;

  constructor(private dataService: DataService,
              private filterOptionService: ExamFilterOptionsService,
              private csvExportService: CsvExportService,
              private translate: TranslateService,
              private angulartics2: Angulartics2,
              private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(schoolId: number, gradeId :number, schoolYear?: number) {
    if (isNullOrUndefined(schoolYear)) {
      return this.filterOptionService.getExamFilterOptions().mergeMap(options => {
        return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, options.schoolYears[ 0 ]);
      });
    }
    else {
      return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, schoolYear);
    }
  }

  getAvailableAssessments() {
    return this.dataService.get(`/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(ResponseUtils.badResponseToNull)
      .map(x => {
        return this.mapper.mapAssessmentsFromApi(x);
      });
  }

  getExams(assessmentId: number) {
    return this.dataService.get(`/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/exams`, { search: this.getSchoolYearParams(this.schoolYear) })
      .catch(ResponseUtils.badResponseToNull)
      .map(x => {
        return this.mapper.mapExamsFromApi(x);
      });
  }

  getAssessmentItems(assessmentId: number, multipleChoiceMultipleSelectItems?: boolean) {
    if (multipleChoiceMultipleSelectItems) {
      return this.dataService.get(`/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/examitems`, {
        params: {
          types: [ 'MC', 'MS' ],
          schoolYear: this.schoolYear.toString()
        }
      })
        .catch(ResponseUtils.badResponseToNull)
        .map(x => {
          return this.mapper.mapAssessmentItemsFromApi(x);
        });
    } else {
      return this.dataService.get(`/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/examitems`, { search: this.getSchoolYearParams(this.schoolYear) })
        .catch(ResponseUtils.badResponseToNull)
        .map(x => {
          return this.mapper.mapAssessmentItemsFromApi(x);
        });
    }
  }

  exportItemsToCsv(exportRequest: ExportRequest) {
    let filename: string = this.getFilename(exportRequest);

    this.angulartics2.eventTrack.next({
      action: 'Export School/Grade Results by Items',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportResultItems(exportRequest, filename);
  }

  private getFilename(exportRequest: ExportRequest) {
    let assessment: Assessment = exportRequest.assessment;
    let filename: string = this.schoolName +
      "-" + this.translate.instant(`labels.grades.${this.grade.code}.short-name`) +
      "-" + assessment.name + "-" + this.translate.instant(exportRequest.type.toString()) + "-" + new Date().toDateString();

    return filename;
  }

  private getRecentAssessmentBySchoolYear(schoolId: number, gradeId: number, schoolYear: number) {
    return this.dataService.get(`/schools/${schoolId}/assessmentGrades/${gradeId}/latestassessment`, { search: this.getSchoolYearParams(schoolYear) })
      .catch(ResponseUtils.badResponseToNull)
      .map(x => {
        if (x == null) return x;

        return this.mapper.mapFromApi(x);
      });
  }

  private getSchoolYearParams(schoolYear): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }
}
