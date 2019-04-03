export interface Assessment {
  id: number;
  label: string;
  name: string;
  grade: string;
  type: string;
  selected: boolean;
  subject: string;
  claimCodes: string[];
  alternateScoreCodes: string[];
}
