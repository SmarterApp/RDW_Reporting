import { inject, TestBed } from '@angular/core/testing';
import { ScaleScoreService } from './scale-score.service';
import { ExamStatisticsLevel } from '../model/exam-statistics.model';

describe('ScaleScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScaleScoreService]
    });
  });

  it('should calculate proper distribution numbers when decimals below min', inject(
    [ScaleScoreService],
    (service: ScaleScoreService) => {
      let level1 = new ExamStatisticsLevel();
      level1.value = 68.75;
      let level2 = new ExamStatisticsLevel();
      level2.value = 14.5833;
      let level3 = new ExamStatisticsLevel();
      level3.value = 6.25;
      let level4 = new ExamStatisticsLevel();
      level4.value = 10.416;

      let original = [level1, level2, level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);
      expect(actual[0]).toBe(66);
      expect(actual[1]).toBe(14);
      expect(actual[2]).toBe(6);
      expect(actual[3]).toBe(10);
    }
  ));

  it('should calculate proper distribution numbers when 0, 1, 9', inject(
    [ScaleScoreService],
    (service: ScaleScoreService) => {
      let level1 = new ExamStatisticsLevel();
      level1.value = 0.0;
      let level2 = new ExamStatisticsLevel();
      level2.value = 10.0;
      let level3 = new ExamStatisticsLevel();
      level3.value = 90.0;

      let original = [level1, level2, level3];

      let actual = service.calculateDisplayScoreDistribution(original);
      expect(actual[0]).toBe(0);
      expect(actual[1]).toBe(10);
      expect(actual[2]).toBe(80);
    }
  ));

  it('should calculate proper distribution numbers all above min', inject(
    [ScaleScoreService],
    (service: ScaleScoreService) => {
      let level1 = new ExamStatisticsLevel();
      level1.value = 20;
      let level2 = new ExamStatisticsLevel();
      level2.value = 30;
      let level3 = new ExamStatisticsLevel();
      level3.value = 40;
      let level4 = new ExamStatisticsLevel();
      level4.value = 10;

      let original = [level1, level2, level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);
      expect(actual[0]).toBe(20.0);
      expect(actual[1]).toBe(30.0);
      expect(actual[2]).toBe(40.0);
      expect(actual[3]).toBe(10.0);
    }
  ));

  it('should calculate proper distribution numbers with some below min', inject(
    [ScaleScoreService],
    (service: ScaleScoreService) => {
      let level1 = new ExamStatisticsLevel();
      level1.value = 5;
      let level2 = new ExamStatisticsLevel();
      level2.value = 32;
      let level3 = new ExamStatisticsLevel();
      level3.value = 3;
      let level4 = new ExamStatisticsLevel();
      level4.value = 60;

      let original = [level1, level2, level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);

      expect(actual[0]).toBe(5);
      expect(actual[1]).toBe(28);
      expect(actual[2]).toBe(3);
      expect(actual[3]).toBe(52);
    }
  ));

  it('should calculate proper distribution numbers when the originals sum to more than 100', inject(
    [ScaleScoreService],
    (service: ScaleScoreService) => {
      let level1 = new ExamStatisticsLevel();
      level1.value = 20;
      let level2 = new ExamStatisticsLevel();
      level2.value = 30;
      let level3 = new ExamStatisticsLevel();
      level3.value = 40;
      let level4 = new ExamStatisticsLevel();
      level4.value = 12;

      let original = [level1, level2, level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);

      expect(actual[0]).toBe(20);
      expect(actual[1]).toBe(30);
      expect(actual[2]).toBe(39);
      expect(actual[3]).toBe(11);
    }
  ));

  it('should calculate proper distribution numbers when the originals sum to zero', inject(
    [ScaleScoreService],
    (service: ScaleScoreService) => {
      let level1 = new ExamStatisticsLevel();
      level1.value = 0;
      let level2 = new ExamStatisticsLevel();
      level2.value = 0;
      let level3 = new ExamStatisticsLevel();
      level3.value = 0;
      let level4 = new ExamStatisticsLevel();
      level4.value = 0;

      let original = [level1, level2, level3, level4];

      let actual = service.calculateDisplayScoreDistribution(original);

      expect(actual[0]).toBe(0);
      expect(actual[1]).toBe(0);
      expect(actual[2]).toBe(0);
      expect(actual[3]).toBe(0);
    }
  ));
});
