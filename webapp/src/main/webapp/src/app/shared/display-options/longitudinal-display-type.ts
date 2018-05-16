// TODO make enum
const GeneralPopulation = 'GeneralPopulation';
const Cohort = 'Cohort';

export abstract class LongitudinalDisplayType {

  static get GeneralPopulation(): string {
    return GeneralPopulation;
  }

  static get Cohort(): string {
    return Cohort;
  }

  static values(): string[] {
    return [ GeneralPopulation, Cohort ];
  }

  static valueOf(input: string): string {
    const value = LongitudinalDisplayType.values().find(value => value === input);
    if (value) {
      return value;
    }
    throw new Error('Unknown LongitudinalDisplayType: ' + input);
  }

}
