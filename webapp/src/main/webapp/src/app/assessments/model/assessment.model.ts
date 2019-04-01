export class Assessment {
  id: number;
  name: string;
  label: string;
  grade: string;
  type: string;
  subject: string;
  alternateScoreCodes: string[];
  claimCodes: string[];
  cutPoints: number[];
  hasWerItem: boolean;
  targetReportEnabled: boolean;

  /** @deprecated TODO this does not belong here but in a UI wrapper */
  resourceUrl: string;
  /** @deprecated TODO this does not belong here but in a UI wrapper */
  selected: boolean;

  /** @deprecated this belongs in a UI wrapper */
  get hasResourceUrl(): boolean {
    return this.resourceUrl != null;
  }

  get isIab(): boolean {
    return this.type === 'iab';
  }

  get isInterim(): boolean {
    return this.type !== 'sum';
  }

  get isSummative(): boolean {
    return this.type === 'sum';
  }

  // TODO:ConfigurableSubjects we need to change from using Assessment.isELA to AssessmentAndSubject.isXYZSupported
  get isEla(): boolean {
    return this.subject === 'ELA';
  }
}
