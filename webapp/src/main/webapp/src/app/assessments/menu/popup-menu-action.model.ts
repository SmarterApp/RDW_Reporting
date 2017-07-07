/**
 * This model represents a menu action.
 */
export class PopupMenuAction {
  public displayName: (rowItem: any) => string;
  public perform: (rowItem: any) => void;
}
