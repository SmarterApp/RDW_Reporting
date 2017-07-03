import {Pipe, PipeTransform} from "@angular/core";
import { Exam } from "../assessments/model/exam.model";

/**
 * This pipe is responsible for transforming an Exam into a
 * Scale Score display string.
 */
@Pipe({name: 'scaleScore'})
export class ScaleScorePipe implements PipeTransform {

  transform(exam: Exam): string {
    let score: number = exam.score;
    let stdErr: number = exam.standardError;
    let errorBand: number = Math.round(stdErr * 1.5);

    return `${score} +/- ${errorBand}`;
  }
}
