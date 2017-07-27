import { Assessment } from "../assessments/model/assessment.model";
import { AssessmentType } from "./enum/assessment-type.enum";
import { TestBed, inject } from "@angular/core/testing";
import { ScaleScoreService } from "./scale-score.service";
import { ExamStatisticsLevel } from "../assessments/model/exam-statistics.model";

describe('Assessment Model', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScaleScoreService
      ]
    });
  });

  it('should return level 1 for score below minimum for ICA',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.ICA;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 20, 1.0);
    expect(actual).toBe(1);
  }));

  it('should return level 4 for score above maximum for ICA',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.ICA;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 9000, 1.0);
    expect(actual).toBe(4);
  }));

  it('should return level 2 for score in range for ICA',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.ICA;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1150, 1.0);
    expect(actual).toBe(2);
  }));

  it('should return level 1 for score far enough below cut point for IAB',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.IAB;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1049, 100.0);
    expect(actual).toBe(1);
  }));

  it('should return level 3 for score far enough above cut point for IAB',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.IAB;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1351, 100);
    expect(actual).toBe(3);
  }));

  it('should return level 2 for score in mid range for IAB',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.IAB;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1150, 100.0);
    expect(actual).toBe(2);
  }));

  it('should calculate proper distribution numbers all above min',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

      let level1 = new ExamStatisticsLevel();
      level1.value = 20;
      let level2 = new ExamStatisticsLevel();
      level2.value = 30;
      let level3 = new ExamStatisticsLevel();
      level3.value = 40;
      let level4 = new ExamStatisticsLevel();
      level4.value = 10;

      let original = [level1, level2,  level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);
      expect(actual[0]).toBe(20.0);
      expect(actual[1]).toBe(30.0);
      expect(actual[2]).toBe(40.0);
      expect(actual[3]).toBe(10.0);
    }));

  it('should calculate proper distribution numbers with some below min',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

      let level1 = new ExamStatisticsLevel();
      level1.value = 5;
      let level2 = new ExamStatisticsLevel();
      level2.value = 32;
      let level3 = new ExamStatisticsLevel();
      level3.value = 3;
      let level4 = new ExamStatisticsLevel();
      level4.value = 60;

      let original = [level1, level2,  level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);

      expect(actual[0]).toBe(5);
      expect(actual[1]).toBe(28);
      expect(actual[2]).toBe(3);
      expect(actual[3]).toBe(52);
    }));

  it('should calculate proper distribution numbers when the originals sum to more than 100',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

      let level1 = new ExamStatisticsLevel();
      level1.value = 20;
      let level2 = new ExamStatisticsLevel();
      level2.value = 30;
      let level3 = new ExamStatisticsLevel();
      level3.value = 40;
      let level4 = new ExamStatisticsLevel();
      level4.value = 12;

      let original = [level1, level2,  level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);

      expect(actual[0]).toBe(20);
      expect(actual[1]).toBe(30);
      expect(actual[2]).toBe(39);
      expect(actual[3]).toBe(11);
    }));

  it('should calculate proper distribution numbers when the originals sum to zero',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

      let level1 = new ExamStatisticsLevel();
      level1.value = 0;
      let level2 = new ExamStatisticsLevel();
      level2.value = 0;
      let level3 = new ExamStatisticsLevel();
      level3.value = 0;
      let level4 = new ExamStatisticsLevel();
      level4.value = 0;

      let original = [level1, level2,  level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);

      expect(actual[0]).toBe(0);
      expect(actual[1]).toBe(0);
      expect(actual[2]).toBe(0);
      expect(actual[3]).toBe(0);
    }));
});
