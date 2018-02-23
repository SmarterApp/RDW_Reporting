import { ReportOrder } from "./report-order.enum";

/**
 * Settings for shaping the content of an exam report
 */
export class ReportOptions {

  public assessmentType: string;
  public subject: string;
  public schoolYear: number;
  public language: string;
  public grayscale: boolean;
  public order: ReportOrder;
  public accommodationsVisible: boolean = false;
  public name: string;
  public disableTransferAccess: boolean = false;

}
