export interface ApplicationSettings {

  readonly irisVendorId: string;
  readonly analyticsTrackingId: string;
  readonly interpretiveGuideUrl: string;
  readonly userGuideUrl: string;
  readonly minItemDataYear: number;
  readonly reportLanguages: string[];
  readonly uiLanguages: string[];
  readonly transferAccess: boolean;
  readonly percentileDisplayEnabled: boolean;
  readonly lepEnabled: boolean;
  readonly elasEnabled: boolean;
  readonly targetReport: TargetReportSettings;
}

export interface TargetReportSettings {
  readonly insufficientDataCutoff: number;
  readonly minimumStudentCount: number;
}
