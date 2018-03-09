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

}
